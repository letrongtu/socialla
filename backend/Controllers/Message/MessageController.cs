using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Message;
using backend.Interfaces;
using backend.Mappers.Message;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Message
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConversationRepository _conversationRepo;
        private readonly IConversationMemberRepository _conversationMemberRepo;
        private readonly IMessageRepository _messageRepo;
        private readonly IMessageVisibilityRepository _messageVisibilityRepo;
        public MessageController(
            UserManager<AppUser> userManager,
            IConversationRepository conversationRepo,
            IConversationMemberRepository conversationMemberRepo,
            IMessageRepository messageRepo,
            IMessageVisibilityRepository messageVisibilityRepo)
        {
            _userManager = userManager;
            _conversationRepo = conversationRepo;
            _conversationMemberRepo = conversationMemberRepo;
            _messageRepo = messageRepo;
            _messageVisibilityRepo = messageVisibilityRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Create(QueryCreateMessageDto queryMessageDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            if(queryMessageDto.Content == null
                || queryMessageDto.Content.Length == 0
                || (queryMessageDto.Content.Length == 1 && string.IsNullOrEmpty(queryMessageDto.Content[0]))
            ){
                return StatusCode(400, "Content is required");
            }

            var sender = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == queryMessageDto.SenderId);

            if(sender == null){
                return NotFound("Sender not found");
            }

            if(queryMessageDto.ConversationId == null && queryMessageDto.UserIds == null){
                return StatusCode(400, "Requires Conversation Id or UserIds");
            }

            if(queryMessageDto.ConversationId == null && queryMessageDto.UserIds != null){
                var conversation = new Conversation {
                    IsGroup = queryMessageDto.UserIds.Length > 1 ? true : false
                };
                // Create conversation if its not created
                var createdConversation = await _conversationRepo.CreateAsync(conversation);

                queryMessageDto.ConversationId = createdConversation.Id;

                foreach(var userId in queryMessageDto.UserIds){
                    var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

                    if(user == null){
                        continue;
                    }

                    var conversationMember = new ConversationMember {
                        ConversationId = createdConversation.Id,
                        UserId = userId,
                        JoinAt = DateTime.Now,
                    };
                    // Create members for the convo
                    await _conversationMemberRepo.CreateAsync(conversationMember);
                }
            }

            if(string.IsNullOrEmpty(queryMessageDto.ConversationId)){
                return StatusCode(400, "Conversation Id Not found or Unable to create conversation");
            }

            var existingConversation = await _conversationRepo.GetById(queryMessageDto.ConversationId);

            if(existingConversation == null){
                return NotFound("Conversation Not Found");
            }

            var createMessageDto = new CreateMessageDto {
                ConversationId = queryMessageDto.ConversationId,
                SenderId = queryMessageDto.SenderId,
                Content = queryMessageDto.Content,
                FileUrls = queryMessageDto.FileUrls,
            };

            // MESSAGE
            var message = createMessageDto.ToMessageFromCreate();
            await _messageRepo.CreateAsync(message);

            // MESSAGE VISIBILITY
            var conversationMembers = await _conversationMemberRepo.GetByConversationId(message.ConversationId);

            foreach(var member in conversationMembers){
                var messageVisibility = new MessageVisibility{
                    ConversationId = message.ConversationId,
                    MessageId = message.Id,
                    UserId = member.UserId
                };

                await _messageVisibilityRepo.CreateAsync(messageVisibility);
            }

            return Ok(new {Message = "Message created", messageId = message.Id});
        }
    }
}
