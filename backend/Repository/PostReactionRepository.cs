using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PostReactionRepository : IPostReactionRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<PostReactionHub> _postReactionHubContext;
        public PostReactionRepository(ApplicationDBContext dBContext, IHubContext<PostReactionHub> postReactionHubContext)
        {
            _dbContext = dBContext;
            _postReactionHubContext = postReactionHubContext;
        }

        public async Task<PostReaction> CreateAsync(PostReaction reaction)
        {
            await _dbContext.PostReactions.AddAsync(reaction);
            await _dbContext.SaveChangesAsync();

            await _postReactionHubContext.Clients.All.SendAsync("ReceivePostReactionChange", reaction.PostId);

            return reaction;
        }

        public async Task<PostReaction?> DeleteByPostIdAndUserIdAsync(string postId, string userId)
        {
            var existingPostReaction = await _dbContext.PostReactions.FirstOrDefaultAsync((reaction) => reaction.PostId == postId && reaction.UserId == userId);

            if(existingPostReaction == null){
                return null;
            }

            _dbContext.PostReactions.Remove(existingPostReaction);
            await _dbContext.SaveChangesAsync();

            await _postReactionHubContext.Clients.All.SendAsync("ReceivePostReactionChange", existingPostReaction.PostId);

            return existingPostReaction;
        }

        public async Task<PostReaction?> GetByPostIdAndUserIdAsync(string postId, string userId)
        {
            return await _dbContext.PostReactions.FirstOrDefaultAsync((reaction) => reaction.PostId == postId && reaction.UserId == userId);
        }

        public async Task<List<PostReaction>> GetByPostIdAsync(string postId)
        {
            return await _dbContext.PostReactions.Where((reaction) => reaction.PostId == postId).ToListAsync();;
        }


        public async Task<PostReaction?> UpdateByIdAsync(string id, string reaction)
        {
            var existingPostReaction = await _dbContext.PostReactions.FirstOrDefaultAsync(x => x.Id == id);

            if(existingPostReaction == null){
                return null;
            }

            existingPostReaction.Reaction = reaction;
            await _dbContext.SaveChangesAsync();

            await _postReactionHubContext.Clients.All.SendAsync("ReceivePostReactionChange", existingPostReaction.PostId);

            return existingPostReaction;
        }
    }
}
