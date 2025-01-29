using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPostReactionRepository
    {
        Task<List<PostReaction>> GetByPostIdAsync(int postId);
        Task<PostReaction?> GetByIdAsync(int id);
        Task<PostReaction> CreateAsync(PostReaction reaction);
        Task<PostReaction?> DeleteAsync(int id);
    }
}
