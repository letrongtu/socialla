using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Message;
using backend.Dtos.MessageVisibility;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers.Message;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IHubContext<ConversationHub> _conversationHubContext;
        private readonly IHubContext<MessageHub> _messageHubContext;
        public MessageController(
            UserManager<AppUser> userManager,
            IConversationRepository conversationRepo,
            IConversationMemberRepository conversationMemberRepo,
            IMessageRepository messageRepo,
            IMessageVisibilityRepository messageVisibilityRepo,
            IHubContext<ConversationHub> conversationHubContext,
            IHubContext<MessageHub> messageHubContext
        ){
            _userManager = userManager;
            _conversationRepo = conversationRepo;
            _conversationMemberRepo = conversationMemberRepo;
            _messageRepo = messageRepo;
            _messageVisibilityRepo = messageVisibilityRepo;
            _conversationHubContext = conversationHubContext;
            _messageHubContext = messageHubContext;
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

            if(string.IsNullOrEmpty(queryMessageDto.ConversationId) && queryMessageDto.UserIds == null){
                return StatusCode(400, "Requires Conversation Id or UserIds");
            }

            // First message to a conversation -> create conversation
            if(string.IsNullOrEmpty(queryMessageDto.ConversationId) && queryMessageDto.UserIds != null){
                var conversation = new backend.Models.Conversation {
                    IsGroup = queryMessageDto.UserIds.Count > 1
                };
                // Create conversation if its not created
                var createdConversation = await _conversationRepo.CreateAsync(conversation);

                queryMessageDto.ConversationId = createdConversation.Id;

                queryMessageDto.UserIds.Add(sender.Id);
                // Send notification to the conversationHub
                await _conversationHubContext.Clients.All.SendAsync("ReceiveConversationCreate", conversation.Id, queryMessageDto.UserIds);

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
                ParentMessageId = queryMessageDto.ParentMessageId,
                Content = queryMessageDto.Content,
                FileUrls = queryMessageDto.FileUrls,
                IsEmojiOnly = queryMessageDto.IsEmojiOnly,
            };

            // MESSAGE
            var message = createMessageDto.ToMessageFromCreate();
            await _messageRepo.CreateAsync(message);

            // MESSAGE VISIBILITY
            var conversationMembers = await _conversationMemberRepo.GetByConversationId(message.ConversationId);

            foreach(var member in conversationMembers){
                var messageVisibility = new backend.Models.MessageVisibility{
                    ConversationId = message.ConversationId,
                    MessageId = message.Id,
                    UserId = member.UserId
                };

                await _messageVisibilityRepo.CreateAsync(messageVisibility);
            }

            return Ok(new {Message = "Message created", messageId = message.Id});
        }

        [HttpDelete]
        [Route("unsend/{messageId}")]
        public async Task<IActionResult> Delete(string messageId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var deletedMessage = await _messageRepo.DeleteAsync(messageId);

            if(deletedMessage == null){
                return NotFound("Message not found");
            }

            return Ok(new {Message = "message deleted", MessageId = deletedMessage.Id});
        }

        [HttpDelete]
        [Route("delete-for-user/{messageId}/{userId}/{conversationId}")]
        public async Task<IActionResult> DeleteForUser(string messageId, string userId, string conversationId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var deletedVisibility = await _messageVisibilityRepo.DeleteAsync(
                new DeleteMessageVisibilityDto{
                    ConversationId = conversationId,
                    MessageId = messageId,
                    UserId = userId});

            if(deletedVisibility == null){
                return NotFound("Message Visibility not found");
            }

            await _messageHubContext.Clients.All.SendAsync("ReceiveMessageVisibilityDelete", deletedVisibility.MessageId, deletedVisibility.UserId, deletedVisibility.ConversationId);

            return Ok(new {Message = "Message visibility deleted", MessageId = deletedVisibility.MessageId, UserId = deletedVisibility.UserId});
        }

        [HttpGet]
        [Route("get-by-id/{messageId}/{userId}")]
        public async Task<IActionResult> GetById(string messageId, string userId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var existingMessage = await _messageRepo.GetById(messageId);

            if(existingMessage == null){
                return Ok(new {Message = existingMessage});
            }

            var userMessageVisibility = _messageVisibilityRepo.GetByMessageIdAndUserID(messageId, userId);

            if(userMessageVisibility == null){
                return Ok(new {Message = userMessageVisibility});
            }

            return Ok(new {Message = existingMessage});
        }

        [HttpGet]
        [Route("{conversationId}/{userId}")]
        public async Task<IActionResult> GetPaginatedByConversationIdAndUserId(string conversationId, string userId, int pageNumber = 1, int pageSize = 20){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var existingConversation = await _conversationRepo.GetById(conversationId);

            if(existingConversation == null){
                return NotFound("Conversation not found");
            }

            var paginatedMessages = await _messageRepo.GetPaginatedByConversationIdAndUserId(conversationId, userId, pageNumber, pageSize);

            return Ok(new {Messages = paginatedMessages.Records, TotalMessages = paginatedMessages.TotalRecords, HasNextPage = paginatedMessages.HasNextPage});
        }
    }
}
