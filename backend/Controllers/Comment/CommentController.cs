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

        public CommentController(UserManager<AppUser> userManager, ICommentRepository commentRepo, IPostRepository postRepository)
        {
            _userManager = userManager;
            _commentRepo = commentRepo;
            _postRepository = postRepository;
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

            return Ok(new {Message = "Comment created", commentId = comment.Id});
        }

        [HttpPut]
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

        [HttpGet]
        [Route("get-by-post-id")]

        public async Task<IActionResult> GetAllByPostIdPaginated(string postId, string sortBy = "top", int pageNumber = 1, int pageSize = 20){
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

            var paginatedComments = await _commentRepo.GetAllByPostIdPaginatedAsync(postId, sortBy, pageNumber, pageSize);

            //TODO: Push the userId new created post to the top of the list
            return Ok(new {Comments = paginatedComments.Records, TotalComments= paginatedComments.TotalRecords, HasNextPage = paginatedComments.HasNextPage});
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

            //TODO: Push the userId new created post to the top of the list
            return Ok(new {Comments = paginatedReplyComments.Records, TotalComments= paginatedReplyComments.TotalRecords, HasNextPage = paginatedReplyComments.HasNextPage});
        }
    }
}
