using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMessageReactionRepository
    {
        Task<MessageReaction> CreateAsync(MessageReaction messageReaction);
        Task<MessageReaction?> DeleteAsync(string messageId, string userId);
        Task<MessageReaction?> UpdateAsync(string reaction, string messageId, string userId);
        Task<MessageReaction?> GetByMessageIdAndUserIdAsync(string messageId, string userId);
        Task<List<MessageReaction>> GetByMessageIdAsync(string messageId);
    }
}
