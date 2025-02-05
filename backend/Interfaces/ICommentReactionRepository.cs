using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICommentReactionRepository
    {
        Task<List<CommentReaction>> GetByCommentIdAsync(string commentId);
        Task<CommentReaction?> GetByCommentIdPostIdAndUserIdAsync(string commentId, string postId, string userId);
        Task<CommentReaction> CreateAsync(CommentReaction reaction);
        Task<CommentReaction?> DeleteByCommentIdPostIdAndUserIdAsync(string commentId, string postId, string userId);
        Task<CommentReaction?> UpdateByIdAsync(string id, string reaction);
    }
}
