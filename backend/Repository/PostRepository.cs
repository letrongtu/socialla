using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Post;
using backend.Interfaces;
using backend.Mappers.Post;
using backend.Models;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Post?> DeleteAsync(int id)
        {
            var post = await _dbContext.Posts.FindAsync(id);

            if(post == null){
                return null;
            }

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();

            return post;
        }

        public async Task<PagedResult<Post>> GetAllPaginatedAsync(int pageNumber, int pageSize)
        {
            var totalRecords = await _dbContext.Posts.CountAsync();

            var paginatedPosts = await _dbContext.Posts
                    .OrderByDescending(post => post.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

            return new PagedResult<Post>{
                Records = paginatedPosts,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<Post?> GetByIdAsync(int id)
        {
            return await _dbContext.Posts.FindAsync(id);
        }

        public async Task<Post?> UpdateAsync(int id, Post post)
        {
            var existingPost = await _dbContext.Posts.FindAsync(id);

            if(existingPost == null){
                return null;
            }

            existingPost.Content = post.Content;
            existingPost.Feeling = post.Feeling;
            existingPost.FileUrls = post.FileUrls;
            existingPost.PostAudience = post.PostAudience;
            existingPost.UpdatedAt = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return existingPost;
        }
    }
}
