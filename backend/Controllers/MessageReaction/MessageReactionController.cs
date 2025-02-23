using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MessageReaction;
using backend.Dtos.PostReaction;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Mappers.MessageReaction;
using backend.Mappers.User;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.MessageReaction
{
    [Route("/api/message-reactions")]
    [ApiController]
    public class MessageReactionController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMessageRepository _messageRepo;
        private readonly IMessageReactionRepository _messageReactionRepo;
        public MessageReactionController(UserManager<AppUser> userManager, IMessageRepository messageRepo, IMessageReactionRepository messageReactionRepo)
        {
            _userManager = userManager;
            _messageRepo = messageRepo;
            _messageReactionRepo = messageReactionRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMessageReactionDto messageReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == messageReactionDto.UserId);

            if(user == null){
                return NotFound("User not found");
            }

            var message = await _messageRepo.GetById(messageReactionDto.MessageId);

            if(message == null){
                return NotFound("Message not found");
            }

            var messageReaction = messageReactionDto.ToMessageReactionFromCreate();

            var createdMessageReaction = await _messageReactionRepo.CreateAsync(messageReaction);

            return Ok(new {Message = "Message Reaction created", MessageId = createdMessageReaction.MessageId, UserId = createdMessageReaction.UserId});
        }

        [HttpDelete]
        [Route("{messageId}/{userId}")]
        public async Task<IActionResult> Delete(string messageId, string userId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null){
                return NotFound("User not found");
            }

            var message = await _messageRepo.GetById(messageId);

            if(message == null){
                return NotFound("Message not found");
            }

            var deletedMessageReaction = await _messageReactionRepo.DeleteAsync(messageId, userId);

            if(deletedMessageReaction == null){
                return NotFound("Reaction not found");
            }

            return Ok(new {Message = "Reaction deleted", essageId = deletedMessageReaction.MessageId, UserId = deletedMessageReaction.UserId});
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateMessageReactionDto messageReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == messageReactionDto.UserId);

            if(user == null){
                return NotFound("User not found");
            }

            var message = await _messageRepo.GetById(messageReactionDto.MessageId);

            if(message == null){
                return NotFound("Message not found");
            }

            var updatedMessageReaction = await _messageReactionRepo.UpdateAsync(messageReactionDto.Reaction, messageReactionDto.MessageId, messageReactionDto.UserId);

            if(updatedMessageReaction == null){
                return NotFound("Reaction not found");
            }

            return Ok(new {Message = "Reaction updated", essageId = updatedMessageReaction.MessageId, UserId = updatedMessageReaction.UserId});
        }

        [HttpGet]
        [Route("get-by-id/{messageId}/{userId}")]
        public async Task<IActionResult> GetById(string messageId, string userId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null){
                return NotFound("User not found");
            }

            var message = await _messageRepo.GetById(messageId);

            if(message == null){
                return NotFound("Message not found");
            }

            var existingMessageReaction = await _messageReactionRepo.GetByMessageIdAndUserIdAsync(messageId, userId);

            return Ok(new {Reaction = existingMessageReaction});
        }

        [HttpGet]
        [Route("{messageId}")]
        public async Task<IActionResult> GetByMessageId(string messageId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var message = await _messageRepo.GetById(messageId);
            if(message == null){
                return StatusCode(400, "Message not found");
            }

            var messageReactions = await _messageReactionRepo.GetByMessageIdAsync(messageId);

            if(messageReactions == null || messageReactions.Count == 0){
                return Ok(new {Message = "This message has no reaction"});
            }

            var userIdsWithReactionCreationTime =
                    messageReactions
                    .Select(reaction => new { reaction.UserId, reaction.CreatedAt})
                    .Distinct()
                    .OrderBy(x => x.CreatedAt);

            var users = await _userManager.Users
                        .Where(user => userIdsWithReactionCreationTime
                        .Select(x => x.UserId).Contains(user.Id))
                        .ToListAsync();

            var sortedUserDictionary = userIdsWithReactionCreationTime
                .Where(x => users.Select(user => user.Id).Contains(x.UserId)) // Ensure user exists
                .ToDictionary(
                    x => x.UserId,
                    x => new ReturnUserForReactionDto{
                        Id = x.UserId,
                        FullName = users.First(user => user.Id == x.UserId).ToReturnUserForReactionDto().FullName,
                        ReactionCreatedAt = x.CreatedAt
                    });

            var messageReactionsByReactionValues =
                    messageReactions
                    .GroupBy(reaction => reaction.Reaction)
                    .Select(group => new ReturnPostReationDto{
                        Reaction = group.Key,
                        Count = group.Count(),
                        Users = group
                                .Where(reaction => sortedUserDictionary.ContainsKey(reaction.UserId))
                                .Select(reaction => sortedUserDictionary[reaction.UserId])
                                .ToList(),
                    })
                    .ToList();

            //add all user (easier for frontend)
            messageReactionsByReactionValues.Add(
                    new ReturnPostReationDto{
                        Reaction = "All",
                        Count = users.Count,
                        Users = [.. sortedUserDictionary.Values],
                    });

            return Ok(new {MessageReactions = messageReactionsByReactionValues});
        }
    }
}
