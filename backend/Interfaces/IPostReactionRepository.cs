using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPostReactionRepository
    {
        Task<List<PostReaction>> GetByPostIdAsync(string postId);
        Task<PostReaction?> GetByPostIdAndUserIdAsync(string postId, string userId);
        Task<PostReaction> CreateAsync(PostReaction reaction);
        Task<PostReaction?> DeleteByPostIdAndUserIdAsync(string postId, string userId);
        Task<PostReaction?> UpdateByIdAsync(string id, string reaction);
    }
}
