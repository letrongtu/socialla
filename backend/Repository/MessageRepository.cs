using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public MessageRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Message> CreateAsync(Message message)
        {
            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            return message;
        }

        public async Task<Message?> DeleteAsync(string messageId)
        {
            var existingMessage = await _dbContext.Messages.FindAsync(messageId);

            if(existingMessage == null){
                return null;
            }

            _dbContext.Messages.Remove(existingMessage);
            await _dbContext.SaveChangesAsync();

            return existingMessage;
        }
    }
}
