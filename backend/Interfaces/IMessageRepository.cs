using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;

namespace backend.Interfaces
{
    public interface IMessageRepository
    {
        Task<Message> CreateAsync(Message message);
        Task<Message?> DeleteAsync(string messageId);
        Task<Message?> GetLastMessageByConversationId(string conversationId);
        Task<Message?> GetById(string messageId);
        Task<PagedResult<Message>> GetPaginatedByConversationIdAndUserId(string conversationId, string userId, int pageNumber, int pageSize);
    }
}
