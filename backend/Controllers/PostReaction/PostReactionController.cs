using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PostReaction;
using backend.Dtos.User;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers.PostReaction;
using backend.Mappers.User;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Post
{
    [Route("api/post-reaction")]
    [ApiController]
    public class PostReactionController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IPostRepository _postRepo;
        private readonly IPostReactionRepository _postReactionRepo;
        public PostReactionController(UserManager<AppUser> userManager, IPostRepository postRepo, IPostReactionRepository postReactionRepo)
        {
            _userManager = userManager;
            _postRepo = postRepo;
            _postReactionRepo = postReactionRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreatePostReactionDto postReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == postReactionDto.UserId);
            if(user == null){
                return StatusCode(400, "User who creates the reaction, is not found");
            }

            var post = await _postRepo.GetByIdAsync(postReactionDto.PostId);
            if(post == null){
                return StatusCode(400, "Post not found");
            }

            var postReaction = postReactionDto.ToPostReactionFromCreate();

            await _postReactionRepo.CreateAsync(postReaction);

            var hubContext = HttpContext.RequestServices.GetRequiredService<IHubContext<PostReactionHub>>();
            await hubContext.Clients.All.SendAsync("ReceivePostReactionUpdate", postReactionDto.PostId);

            return Ok(new {Message = "Reaction created", ReactionId = postReaction.Id});
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(DeletePostReactionDto postReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var deletedPostReaction = await _postReactionRepo.DeleteByPostIdAndUserIdAsync(postReactionDto.PostId, postReactionDto.UserId);

            if(deletedPostReaction == null){
                return NotFound("Post Reaction doesn't exist");
            }

            var hubContext = HttpContext.RequestServices.GetRequiredService<IHubContext<PostReactionHub>>();
            await hubContext.Clients.All.SendAsync("ReceivePostReactionUpdate", postReactionDto.PostId);

            return Ok(new {Message = "Post Reaction deleted", PostId = deletedPostReaction.Id});
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update(UpdatePostReactionDto postReactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var existingPostReaction = await _postReactionRepo.GetByPostIdAndUserIdAsync(postReactionDto.PostId, postReactionDto.UserId);

            if(existingPostReaction == null){
                return NotFound("Post Reaction doesn't exist");
            }

            var newPostReaction = await _postReactionRepo.UpdateByIdAsync(existingPostReaction.Id, postReactionDto.Reaction);

            if(newPostReaction == null){
                return NotFound("Cannot update post reaction");
            }

            var hubContext = HttpContext.RequestServices.GetRequiredService<IHubContext<PostReactionHub>>();
            await hubContext.Clients.All.SendAsync("ReceivePostReactionUpdate", postReactionDto.PostId);

            return Ok(new {Message = "Post Reaction updated", PostId = newPostReaction.Id});
        }

        [HttpGet]
        [Route("{postId}")]
        [Authorize]
        public async Task<IActionResult> GetByPostId([FromRoute] string postId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var post = await _postRepo.GetByIdAsync(postId);
            if(post == null){
                return StatusCode(400, "Post not found");
            }

            var postReactions = await _postReactionRepo.GetByPostIdAsync(postId);

            if(postReactions == null || postReactions.Count == 0){
                return Ok(new {Message = "This post has no reaction"});
            }

            var userIdsWithReactionCreationTime =
                    postReactions
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

            var postReactionsByReactionValues =
                    postReactions
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
            postReactionsByReactionValues.Add(
                    new ReturnPostReationDto{
                        Reaction = "All",
                        Count = users.Count,
                        Users = [.. sortedUserDictionary.Values],
                    });

            return Ok(new {PostReactions = postReactionsByReactionValues});
        }

    }
}
