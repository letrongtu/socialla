using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Post;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers.Post;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly ICommentRepository _commentRepo;
        private readonly IFriendshipRepository _friendshipRepo;
        private readonly IHubContext<PostHub> _postHubContext;
        public PostRepository(ApplicationDBContext dbContext, ICommentRepository commentRepo, IFriendshipRepository friendshipRepo, IHubContext<PostHub> postHubContext)
        {
            _dbContext = dbContext;
            _commentRepo = commentRepo;
            _friendshipRepo = friendshipRepo;
            _postHubContext = postHubContext;
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            await _dbContext.Posts.AddAsync(post);
            await _dbContext.SaveChangesAsync();

            await _postHubContext.Clients.All.SendAsync("ReceivePostCreate", post);

            return post;
        }

        public async Task<Post?> DeleteAsync(string id)
        {
            var post = await _dbContext.Posts.FindAsync(id);

            if(post == null){
                return null;
            }

            var postReactions = await _dbContext.PostReactions.Where((postReaction) => postReaction.PostId == post.Id).ToListAsync();
            _dbContext.PostReactions.RemoveRange(postReactions);

            var postComments = await _dbContext.Comments.Where((comment) => comment.PostId == post.Id).ToListAsync();

            foreach(var comment in postComments){
                await _commentRepo.DeleteAsync(comment.Id);
            }

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();

            await _postHubContext.Clients.All.SendAsync("ReceivePostDelete", post);

            return post;
        }

        public async Task<PagedResult<Post>> GetAllPaginatedAsync(string userId, int pageNumber, int pageSize)
        {
            var totalRecords = await _dbContext.Posts.CountAsync();

            var publicAndOnlyMePosts = await _dbContext.Posts
                                                .Where(post => post.PostAudience == "Public"
                                                                || (post.PostAudience== "Only Me" && post.UserId == userId))
                                                .ToListAsync();

            var friendsPosts = await _dbContext.Posts
                                            .Where(post => post.PostAudience.ToLower().Trim() == "Friends")
                                            .ToListAsync();

            var filteredFriendPosts = new List<Post>();

            foreach(var post in friendsPosts){
                var existingFriendship = await _friendshipRepo.CheckFriendshipAsync(userId, post.UserId);

                if(existingFriendship != null && existingFriendship.Status == FriendshipStatus.Accepted){
                    filteredFriendPosts.Add(post);
                }
            }

            var paginatedPosts = publicAndOnlyMePosts.Concat(filteredFriendPosts)
                    .OrderByDescending(post => post.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

            return new PagedResult<Post>{
                Records = paginatedPosts,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<Post?> GetByIdAsync(string id)
        {
            return await _dbContext.Posts.FindAsync(id);
        }

        public async Task<Post?> UpdateAsync(string id, Post post)
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

            await _postHubContext.Clients.All.SendAsync("ReceivePostUpdate", existingPost);

            return existingPost;
        }
    }
}
