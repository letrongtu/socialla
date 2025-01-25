using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Post;
using backend.Interfaces;
using backend.Mappers.Post;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Post
{
    [Route("api/post")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostRepository _postRepo;
        private readonly UserManager<AppUser> _userManager;
        public PostController(IPostRepository postRepo, UserManager<AppUser> userManager)
        {
            _postRepo = postRepo;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePostDto postDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            bool isPostDtoEmpty = (postDto.Content == null || postDto.Content.Length == 0) &&
            string.IsNullOrEmpty(postDto.Feeling) &&
            (postDto.ImageUrls == null || postDto.ImageUrls.Length == 0);

            if(isPostDtoEmpty){
                return BadRequest("Requires at least one of 'Content', 'Images', 'Feeling' fields is required");
            }

            if(string.IsNullOrEmpty(postDto.PostAudience)){
                return BadRequest("Post Audience is required");
            }

            if(string.IsNullOrEmpty(postDto.UserId)){
                return BadRequest("User Id is required");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == postDto.UserId);

            if(user == null){
                return StatusCode(400, "User who creates the post, is not found");
            }

            var post = postDto.ToPostFromCreate();

            await _postRepo.CreatePostAsync(post);

            return Ok(new {Message="Post created", PostId = post.Id});
        }
    }
}
