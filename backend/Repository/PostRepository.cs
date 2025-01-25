using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public PostRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Post> CreatePostAsync(Post post)
        {
            await _dbContext.Posts.AddAsync(post);
            await _dbContext.SaveChangesAsync();

            return post;
        }
    }
}
