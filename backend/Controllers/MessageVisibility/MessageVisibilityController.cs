using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MessageVisibility;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.MessageVisibility
{
    [Route("api/message-visibility")]
    public class MessageVisibilityController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConversationRepository _conversationRepo;
        private readonly IConversationMemberRepository _conversationMemberRepo;
        private readonly IMessageRepository _messageRepo;
        private readonly IMessageVisibilityRepository _messageVisibilityRepo;
        public MessageVisibilityController(
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

        [HttpDelete]
        public async Task<IActionResult> Delete(DeleteMessageVisibilityDto mvDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == mvDto.UserId);

            if(user == null){
                return NotFound("User not found");
            }

            var message = await _messageRepo.GetById(mvDto.MessageId);

            if(message == null){
                return NotFound("Message not found");
            }

            var conversation = await _conversationRepo.GetById(mvDto.ConversationId);

            if(conversation == null){
                return NotFound("Conversation not found");
            }

            var mv = await _messageVisibilityRepo.DeleteAsync(mvDto);

            if(mv == null){
                return NotFound("Message Visibility not found");
            }

            return Ok(new {Message = "Deleted Message for user", MessageId = message.Id, UserId = user.Id});
        }

    }
}
