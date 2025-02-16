using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IConversationRepository
    {
        Task<Conversation> CreateAsync(Conversation conversation);
        Task<Conversation?> DeleteAsync(string convId);
        Task<Conversation?> GetById(string conversationId);
    }
}
