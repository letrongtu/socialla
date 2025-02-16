using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public ConversationRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Conversation> CreateAsync(Conversation conversation)
        {
            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();

            return conversation;
        }

        public async Task<Conversation?> DeleteAsync(string convId)
        {
            var existingConversation = await _dbContext.Conversations.FindAsync(convId);

            if(existingConversation == null){
                return null;
            }

            _dbContext.Conversations.Remove(existingConversation);
            await _dbContext.SaveChangesAsync();

            return existingConversation;
        }

        public async Task<Conversation?> GetById(string conversationId){
            return await _dbContext.Conversations.FindAsync(conversationId);
        }
    }
}
