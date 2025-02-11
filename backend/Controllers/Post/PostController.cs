using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Post;
using backend.Interfaces;
using backend.Mappers.Post;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
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
        private readonly INotificationRepository _notificationRepo;
        private readonly IFriendshipRepository _friendshipRepo;
        public PostController(IPostRepository postRepo, UserManager<AppUser> userManager, INotificationRepository notificationRepo, IFriendshipRepository friendshipRepo)
        {
            _postRepo = postRepo;
            _userManager = userManager;
            _notificationRepo= notificationRepo;
            _friendshipRepo = friendshipRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreatePostDto postDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            bool isPostDtoEmpty = (postDto.Content == null || postDto.Content.Length == 0) &&
                                    string.IsNullOrEmpty(postDto.Feeling) &&
                                    (postDto.FileUrls == null || postDto.FileUrls.Length == 0);

            if(isPostDtoEmpty){
                return BadRequest("Requires at least one of 'Content', 'Images', 'Feeling' fields");
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

            if(post.PostAudience != "Only Me")
            {
                var userFriends = await _friendshipRepo.GetAllByUserIdAsync(user.Id);

                foreach(var friend in userFriends){
                    var friendId = friend.FirstUserId == user.Id ? friend.SecondUserId : friend.FirstUserId;

                    var notification = new backend.Models.Notification{
                        ReceiveUserId = friendId,
                        EntityType = NotificationEntityType.User,
                        EntityId = user.Id,
                        Type = NotificationType.Post_Created,
                        PostId = post.Id,
                        Content = "posted ",
                    };

                    await _notificationRepo.CreateAsync(notification);
                }
            }

            return Ok(new {Message="Post created", PostId = post.Id});
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] string id){
            if(!ModelState.IsValid){
            return BadRequest(ModelState);
            }

            var deletedPost = await _postRepo.DeleteAsync(id);

            if(deletedPost == null){
            return NotFound("Post not found");
            }

            return Ok(new {Message = "Post deleted", postId = id});
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllPaginated(string userId, int pageNumber = 1, int pageSize = 20){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

            if(user == null){
                return StatusCode(400, "User not found");
            }

            if(pageNumber < 1 || pageSize < 1){
                return BadRequest("Page number and page size must be greater than 0");
            }

            var paginatedPosts = await _postRepo.GetAllPaginatedAsync(userId, pageNumber, pageSize);

            return Ok(new {Posts = paginatedPosts.Records, TotalPosts = paginatedPosts.TotalRecords, HasNextPage = paginatedPosts.HasNextPage});
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var post = await _postRepo.GetByIdAsync(id);

            if(post == null){
                return NotFound("Post not found");
            }

            return Ok(new {Post = post});
        }
    }
}
