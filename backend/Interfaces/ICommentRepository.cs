using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Comment;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<PagedResult<Comment>> GetAllByPostIdPaginatedAsync(string postId, string sortBy, int pageNumber, int pageSize);
        Task<PagedResult<Comment>> GetReplyCommentsByParentCommentIdPagedAsync(string parentCommentId, string sortBy, int pageNumber, int pageSize);
        Task<Comment?> GetByIdAsync(string commentId);
        Task<Comment> CreateAsync(Comment comment);
        Task<Comment?> UpdateAsync(UpdateCommentDto commentDto);
    }
}
