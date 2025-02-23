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
    public class MessageReactionRepository : IMessageReactionRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<MessageReactionHub> _hubContext;
        public MessageReactionRepository(ApplicationDBContext dbContext, IHubContext<MessageReactionHub> hubContext)
        {
            _dbContext = dbContext;
            _hubContext = hubContext;
        }

        public async Task<MessageReaction> CreateAsync(MessageReaction messageReaction)
        {
            await _dbContext.MessageReactions.AddAsync(messageReaction);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageReactionChange", messageReaction.MessageId);

            return messageReaction;
        }

        public async Task<MessageReaction?> DeleteAsync(string messageId, string userId)
        {
            var existingMessageReaction = await _dbContext.MessageReactions.FirstOrDefaultAsync(mr => mr.MessageId == messageId && mr.UserId == userId);

            if(existingMessageReaction == null){
                return null;
            }

            _dbContext.MessageReactions.Remove(existingMessageReaction);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageReactionChange", existingMessageReaction.MessageId);

            return existingMessageReaction;
        }

        public async Task<MessageReaction?> UpdateAsync(string reaction, string messageId, string userId)
        {
            var existingMessageReaction = await _dbContext.MessageReactions.FirstOrDefaultAsync(mr => mr.MessageId == messageId && mr.UserId == userId);

            if(existingMessageReaction == null){
                return null;
            }

            existingMessageReaction.Reaction = reaction;
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageReactionChange", existingMessageReaction.MessageId);

            return existingMessageReaction;
        }

        public async Task<MessageReaction?> GetByMessageIdAndUserIdAsync(string messageId, string userId){
            return await _dbContext.MessageReactions.FirstOrDefaultAsync(mr => mr.MessageId == messageId && mr.UserId == userId);
        }

        public async Task<List<MessageReaction>> GetByMessageIdAsync(string messageId)
        {
            return await _dbContext.MessageReactions.Where((mr) => mr.MessageId == messageId).ToListAsync();
        }
    }
}
