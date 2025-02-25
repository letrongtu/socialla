using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Comment;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers.Comment;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Comment
{
    [Route("/api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ICommentRepository _commentRepo;
        private readonly IPostRepository _postRepository;
        private readonly  INotificationRepository _notificationRepo;
        public CommentController(UserManager<AppUser> userManager, ICommentRepository commentRepo, IPostRepository postRepository,  INotificationRepository notificationRepo)
        {
            _userManager = userManager;
            _commentRepo = commentRepo;
            _postRepository = postRepository;
            _notificationRepo = notificationRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateCommentDto commentDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            bool isCommentDtoEmpty = commentDto.Content == null || commentDto.Content.Length == 0;

            if(isCommentDtoEmpty){
                return BadRequest("Requires 'Content' fields");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == commentDto.UserId);

            if(user == null){
                return StatusCode(400, "User not found");
            }

            var post = await _postRepository.GetByIdAsync(commentDto.PostId);

            if(post == null){
                return StatusCode(400, "Post not found");
            }

            if(commentDto.ParentCommentId != null){
                var parentComment = await _commentRepo.GetByIdAsync(commentDto.ParentCommentId);
                if(parentComment == null){
                    return StatusCode(400, "Parent Comment not found");
                }
            }

            var comment = commentDto.ToCommentFromCreateCommentDto();

            await _commentRepo.CreateAsync(comment);

            if(comment.ParentCommentId == null && post.UserId != user.Id){
                var notification = new backend.Models.Notification{
                    ReceiveUserId = post.UserId, //User who created the post
                    EntityType = NotificationEntityType.User,
                    EntityId = user.Id,
                    Type = NotificationType.Comment_Created,
                    PostId = post.Id,
                    Content = "commented to your post",
                };

                await _notificationRepo.CreateAsync(notification);
            }

            if(comment.ParentCommentId != null){
                var parentComment = await _commentRepo.GetByIdAsync(comment.ParentCommentId);
                if(parentComment == null){
                    return StatusCode(400, "Parent Comment not found");
                }

                var notification = new backend.Models.Notification{
                    ReceiveUserId = parentComment.UserId, //User who created the parent comment
                    EntityType = NotificationEntityType.User,
                    EntityId = comment.UserId, //User who created the replied comment
                    Type = NotificationType.Reply_Comment,
                    PostId = post.Id,
                    CommentId = parentComment.Id,
                    Content = "replied to your comment",
                };

                await _notificationRepo.CreateAsync(notification);
            }

            return Ok(new {Message = "Comment created", commentId = comment.Id});
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Update(UpdateCommentDto commentDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var updatedComment = await _commentRepo.UpdateAsync(commentDto);

            if(updatedComment == null){
                return NotFound("Comment not found");
            }

            return Ok(new {Message = "Comment updated", commentId = commentDto.Id});
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] string id){
            if(!ModelState.IsValid){
            return BadRequest(ModelState);
            }

            var deletedComment = await _commentRepo.DeleteAsync(id);

            if(deletedComment == null){
            return NotFound("Comment not found");
            }

            return Ok(new {Message = "Comment deleted", commentId = id});
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var comment = await _commentRepo.GetByIdAsync(id);

            if(comment == null){
                return NotFound("Comment not found");
            }

            return Ok(new {Comment = comment});
        }

        [HttpGet]
        [Route("get-by-post-id")]
        [Authorize]
        public async Task<IActionResult> GetByPostIdPaginated(string postId, string sortBy = "top", int pageNumber = 1, int pageSize = 20){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var post = await _postRepository.GetByIdAsync(postId);

            if(post == null){
                return StatusCode(400, "Post not found");
            }

            if(pageNumber < 1 || pageSize < 1){
                return BadRequest("Page number and page size must be greater than 0");
            }

            var paginatedComments = await _commentRepo.GetParentCommentsByPostIdPaginatedAsync(postId, sortBy, pageNumber, pageSize);

            return Ok(new {Comments = paginatedComments.Records, TotalParentComments= paginatedComments.TotalRecords, TotalPostComments = paginatedComments.TotalPostCommentRecords, HasNextPage = paginatedComments.HasNextPage});
        }

        [HttpGet]
        [Route("get-by-parent-comment-id")]
        [Authorize]
        public async Task<IActionResult> GetByParentCommentId(string parentCommentId, string sortBy = "top", int pageNumber = 1, int pageSize = 20){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var parentComment = await _commentRepo.GetByIdAsync(parentCommentId);

            if(parentComment == null){
                return StatusCode(400, "Parent comment not found");
            }

            if(pageNumber < 1 || pageSize < 1){
                return BadRequest("Page number and page size must be greater than 0");
            }

            var paginatedReplyComments = await _commentRepo.GetReplyCommentsByParentCommentIdPagedAsync(parentCommentId, sortBy, pageNumber, pageSize);

            return Ok(new {Comments = paginatedReplyComments.Records, TotalReplyComments= paginatedReplyComments.TotalRecords, HasNextPage = paginatedReplyComments.HasNextPage});
        }
    }
}
