using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PostReaction;
using backend.Interfaces;
using backend.Mappers.PostReaction;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Create(CreatePostReactionDto reactionDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == reactionDto.UserId);
            if(user == null){
                return StatusCode(400, "User who creates the reaction, is not found");
            }

            var post = await _postRepo.GetByIdAsync(reactionDto.PostId);
            if(post == null){
                return StatusCode(400, "Post not found");
            }

            var postReaction = reactionDto.ToPostReactionFromCreate();

            await _postReactionRepo.CreateAsync(postReaction);

            return Ok(new {Message = "Reaction created", ReactionId = postReaction.Id});
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int postReactionId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var postReaction = await _postReactionRepo.DeleteAsync(postReactionId);

            if(postReaction == null){
                return NotFound("Post Reaction doesn't exist");
            }

            return Ok(postReaction);
        }

        [HttpGet]
        public async Task<IActionResult> GetByPostId(int postId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var post = await _postRepo.GetByIdAsync(postId);
            if(post == null){
                return StatusCode(400, "Post not found");
            }

            var postReactions = await _postReactionRepo.GetByPostIdAsync(postId);

            if(postReactions == null){
                return Ok(new {Message = "This post has no reaction"});
            }

            var postReactionsByReactionValues = new List<ReturnPostReationDto>();

            foreach(var postReaction in postReactions){
                var postReactionByReactionValue = postReactionsByReactionValues.FirstOrDefault(postReactionByReactionValue => postReactionByReactionValue.Reaction == postReaction.Reaction);

                if(postReactionByReactionValue == null){
                    postReactionsByReactionValues.Add(postReaction.ToReturnPostReactionDto());
                    continue;
                }

                postReactionByReactionValue.Count++;
                postReactionByReactionValue.UserIds.Add(postReaction.UserId);
            }

            return Ok(postReactionsByReactionValues);
        }

    }
}
