using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Comment;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class CommentReposity : ICommentRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<PostCommentHub> _postCommentHubContext;
        public CommentReposity(ApplicationDBContext dBContext, IHubContext<PostCommentHub> postCommentHubContext)
        {
            _dbContext = dBContext;
              _postCommentHubContext = postCommentHubContext;
        }

        public async Task<PagedResult<Comment>> GetAllByPostIdPaginatedAsync(string postId, string sortBy, int pageNumber, int pageSize)
        {
            var totalRecords = await _dbContext.Comments.CountAsync();

            var paginatedComments = await _dbContext.Comments
                    .Where((comment) => comment.PostId == postId && comment.ParentCommentId == null)
                    .OrderByDescending(comment => comment.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

            if(sortBy == "top"){
                paginatedComments = await _dbContext.Comments
                    .Where(comment => comment.PostId == postId && comment.ParentCommentId == null)
                    .Select(comment => new
                    {
                        Comment = comment,
                        ReplyCount = _dbContext.Comments.Count(reply => reply.ParentCommentId == comment.Id)
                    })
                    .OrderByDescending(c => c.ReplyCount)
                    .ThenBy(c => c.Comment.CreatedAt) // Optionally sort by CreatedAt for same reply counts
                    .Select(c => c.Comment) // Select only the comment object
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }

            //TODO: Modify when add comment reaction

            return new PagedResult<Comment>{
                Records = paginatedComments,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<Comment>> GetReplyCommentsByParentCommentIdPagedAsync(string parentCommentId, string sortBy, int pageNumber, int pageSize)
        {
            var totalRecords = await _dbContext.Comments.Where((comment) => comment.ParentCommentId == parentCommentId).CountAsync();

            var paginatedComments = await _dbContext.Comments
                    .Where((comment) => comment.ParentCommentId == parentCommentId)
                    .OrderByDescending(comment => comment.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();


            if(sortBy == "top"){
                paginatedComments = await _dbContext.Comments
                    .Where(comment => comment.ParentCommentId == parentCommentId)
                    .Select(comment => new
                    {
                        Comment = comment,
                        ReplyCount = _dbContext.Comments.Count(reply => reply.ParentCommentId == comment.Id)
                    })
                    .OrderByDescending(c => c.ReplyCount)
                    .ThenBy(c => c.Comment.CreatedAt) // Optionally sort by CreatedAt for same reply counts
                    .Select(c => c.Comment) // Select only the comment object
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }

            //TODO: Modify when add comment reaction

            return new PagedResult<Comment>{
                Records = paginatedComments,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<Comment?> GetByIdAsync(string commentId)
        {
            return await _dbContext.Comments.FindAsync(commentId);
        }

        public async Task<Comment> CreateAsync(Comment comment)
        {
            await _dbContext.Comments.AddAsync(comment);
            await _dbContext.SaveChangesAsync();

            await _postCommentHubContext.Clients.All.SendAsync("ReceivePostCommentCreate", comment);

            return comment;
        }

        public async Task<Comment?> UpdateAsync(UpdateCommentDto commentDto)
        {
            var existingComment = await _dbContext.Comments.FindAsync(commentDto.Id);

            if(existingComment == null){
                return null;
            }

            existingComment.Content = commentDto.Content;
            existingComment.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            await _postCommentHubContext.Clients.All.SendAsync("ReceivePostCommentUpdate", existingComment);

            return existingComment;
        }
    }
}
