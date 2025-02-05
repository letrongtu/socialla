using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.CommentReaction;
using backend.Dtos.PostReaction;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Mappers.CommentReaction;
using backend.Mappers.User;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.CommentReaction
{

    [Route("api/comment-reaction")]
    [ApiController]
    public class CommentReactionController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ICommentRepository _commentRepo;
        private readonly ICommentReactionRepository _commentReactionRepo;
        public CommentReactionController(UserManager<AppUser> userManager, ICommentRepository commentRepo, ICommentReactionRepository commentReactionRepo)
        {
            _userManager = userManager;
            _commentRepo = commentRepo;
            _commentReactionRepo = commentReactionRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateCommentReactionDto commentReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == commentReactionDto.UserId);
            if(user == null){
                return StatusCode(400, "User who creates the reaction, is not found");
            }

            var comment = await _commentRepo.GetByIdAsync(commentReactionDto.PostId);
            if(comment == null){
                return StatusCode(400, "Comment not found");
            }

            var commentReaction = commentReactionDto.ToCommentReactionFromCreate();

            await _commentReactionRepo.CreateAsync(commentReaction);

            return Ok(new {Message = "Reaction created", ReactionId = commentReaction.Id});
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(DeleteCommentReactionDto commentReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var deletedCommentReaction = await _commentReactionRepo.DeleteByCommentIdPostIdAndUserIdAsync(commentReactionDto.CommentId, commentReactionDto.PostId, commentReactionDto.UserId);

            if(deletedCommentReaction == null){
                return NotFound("Comment Reaction doesn't exist");
            }

            // var hubContext = HttpContext.RequestServices.GetRequiredService<IHubContext<PostReactionHub>>();
            // await hubContext.Clients.All.SendAsync("ReceivePostReactionUpdate", postReactionDto.PostId);

            return Ok(new {Message = "Comment Reaction deleted", ReactionId = deletedCommentReaction.Id});
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update(UpdateCommentReactionDto commentReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var existingCommentReaction = await _commentReactionRepo.GetByCommentIdPostIdAndUserIdAsync(commentReactionDto.CommentId, commentReactionDto.PostId, commentReactionDto.UserId);

            if(existingCommentReaction == null){
                return NotFound("Comment Reaction doesn't exist");
            }

            var newCommentReaction = await _commentReactionRepo.UpdateByIdAsync(existingCommentReaction.Id, existingCommentReaction.Reaction);

            if(newCommentReaction == null){
                return NotFound("Cannot update comment reaction");
            }

            // var hubContext = HttpContext.RequestServices.GetRequiredService<IHubContext<PostReactionHub>>();
            // await hubContext.Clients.All.SendAsync("ReceivePostReactionUpdate", postReactionDto.PostId);

            return Ok(new {Message = "Comment Reaction updated", ReactionId = newCommentReaction.Id});
        }

        [HttpGet]
        [Route("{commentId}")]
        [Authorize]
        public async Task<IActionResult> GetByCommentId([FromRoute] string commentId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var comment = await _commentRepo.GetByIdAsync(commentId);
            if(comment == null){
                return StatusCode(400, "Comment not found");
            }

            var commentReactions = await _commentReactionRepo.GetByCommentIdAsync(commentId);

            if(commentReactions == null || commentReactions.Count == 0){
                return Ok(new {Message = "This comment has no reaction"});
            }

            var userIdsWithReactionCreationTime =
                    commentReactions
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

            var commentReactionsByReactionValues =
                    commentReactions
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
            commentReactionsByReactionValues.Add(
                    new ReturnPostReationDto{
                        Reaction = "All",
                        Count = users.Count,
                        Users = [.. sortedUserDictionary.Values],
                    });

            return Ok(new {CommentReactions = commentReactionsByReactionValues});
        }

    }
}
