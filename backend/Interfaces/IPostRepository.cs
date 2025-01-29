using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Post;
using backend.Models;
using backend.Utils;

namespace backend.Interfaces
{
    public interface IPostRepository
    {
        Task<PagedResult<Post>> GetAllPaginatedAsync(int pageNumber, int pageSize);
        Task<Post?> GetByIdAsync(int id);
        Task<Post> CreatePostAsync(Post post);
        Task<Post?> DeleteAsync(int id);
        Task<Post?> UpdateAsync(int id, Post post);
    }
}
