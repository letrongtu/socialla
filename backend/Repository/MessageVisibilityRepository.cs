using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.MessageVisibility;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MessageVisibilityRepository : IMessageVisibilityRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public MessageVisibilityRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;

        }

        public async Task<MessageVisibility> CreateAsync(MessageVisibility messageVisibility)
        {
            await _dbContext.MessageVisibilities.AddAsync(messageVisibility);
            await _dbContext.SaveChangesAsync();

            return messageVisibility;
        }

        public async Task<MessageVisibility?> DeleteAsync(DeleteMessageVisibilityDto messageVisibilityDto)
        {
            var existingMessageVisibility = await _dbContext.MessageVisibilities.FirstOrDefaultAsync(
                (mv) => mv.ConversationId == messageVisibilityDto.ConversationId
                        && mv.MessageId == messageVisibilityDto.MessageId
                        && mv.UserId == messageVisibilityDto.UserId
            );

            if(existingMessageVisibility == null){
                return null;
            }

            _dbContext.MessageVisibilities.Remove(existingMessageVisibility);
            await _dbContext.SaveChangesAsync();

            return existingMessageVisibility;
        }
    }
}
