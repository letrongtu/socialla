using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class PostReactionRepository : IPostReactionRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public PostReactionRepository(ApplicationDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public async Task<PostReaction> CreateAsync(PostReaction reaction)
        {
            await _dbContext.PostReactions.AddAsync(reaction);
            await _dbContext.SaveChangesAsync();

            return reaction;
        }

        public async Task<PostReaction?> DeleteAsync(int id)
        {
            var reaction = await _dbContext.PostReactions.FindAsync(id);

            if(reaction == null){
                return null;
            }

            _dbContext.PostReactions.Remove(reaction);
            await _dbContext.SaveChangesAsync();

            return reaction;
        }

        public async Task<List<PostReaction>> GetByPostIdAsync(int postId)
        {
            var reactions = await _dbContext.PostReactions.ToListAsync();

            var postReactions = reactions.Where((reaction) => reaction.PostId == postId).ToList();

            return postReactions;
        }

        public async Task<PostReaction?> GetByIdAsync(int id)
        {
            return await _dbContext.PostReactions.FindAsync(id);
        }
    }
}
