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
    public class CommentReactionRepository : ICommentReactionRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<CommentReactionHub> _commentReactionHubContext;
        public CommentReactionRepository(ApplicationDBContext dBContext, IHubContext<CommentReactionHub> commentReactionHubContext)
        {
            _dbContext = dBContext;
            _commentReactionHubContext = commentReactionHubContext;
        }

        public async Task<CommentReaction> CreateAsync(CommentReaction reaction)
        {
            await _dbContext.CommentReactions.AddAsync(reaction);
            await _dbContext.SaveChangesAsync();

            await _commentReactionHubContext.Clients.All.SendAsync("ReceiveCommentReactionChange", reaction.CommentId);

            return reaction;
        }

        public async Task<CommentReaction?> DeleteByCommentIdPostIdAndUserIdAsync(string commentId, string postId, string userId)
        {
            var existingCommentReaction = await _dbContext.CommentReactions
                                        .FirstOrDefaultAsync((reaction) =>
                                                reaction.CommentId == commentId
                                                && reaction.PostId == postId
                                                && reaction.UserId == userId);

            if(existingCommentReaction == null){
                return null;
            }

            _dbContext.CommentReactions.Remove(existingCommentReaction);
            await _dbContext.SaveChangesAsync();

            await _commentReactionHubContext.Clients.All.SendAsync("ReceiveCommentReactionChange", existingCommentReaction.CommentId);

            return existingCommentReaction;
        }

        public async Task<CommentReaction?> UpdateByIdAsync(string id, string reaction)
        {
            var existingCommentReaction = await _dbContext.CommentReactions.FirstOrDefaultAsync(x => x.Id == id);

            if(existingCommentReaction == null){
                return null;
            }

            existingCommentReaction.Reaction = reaction;
            await _dbContext.SaveChangesAsync();

            await _commentReactionHubContext.Clients.All.SendAsync("ReceiveCommentReactionChange", existingCommentReaction.CommentId);

            return existingCommentReaction;
        }

        public async Task<List<CommentReaction>> GetByCommentIdAsync(string commentId)
        {
            return await _dbContext.CommentReactions.Where((reaction) => reaction.CommentId == commentId).ToListAsync();
        }

        public async Task<CommentReaction?> GetByCommentIdPostIdAndUserIdAsync(string commentId, string postId, string userId)
        {
            return await _dbContext.CommentReactions.FirstOrDefaultAsync((reaction) => reaction.CommentId == commentId && reaction.PostId == postId && reaction.UserId == userId);
        }

    }
}
