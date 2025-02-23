using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Conversation
{
    [Route("api/conversations")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationRepository _conversationRepo;
        public ConversationController(IConversationRepository conversationRepo)
        {
            _conversationRepo = conversationRepo;
        }

        [HttpGet]
        [Route("{firstUserId}/{secondUserId}")]
        public async Task<IActionResult> GetDmConversation(string firstUserId, string secondUserId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var conversation = await _conversationRepo.GetDmConversationByUserIds(firstUserId, secondUserId);

            return Ok(new {ConversationId = conversation?.Id });
        }

        [HttpDelete]
        [Route("{conversationId}")]
        public async Task<IActionResult> Delete(string conversationId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var conversation = await _conversationRepo.DeleteAsync(conversationId);

            return Ok(new {ConversationId = conversation?.Id });
        }
    }
}
