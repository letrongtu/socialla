using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Conversation;
using backend.Models;
using backend.Utils;

namespace backend.Interfaces
{
    public interface IConversationRepository
    {
        Task<Conversation> CreateAsync(Conversation conversation);
        Task<Conversation?> DeleteAsync(string convId, string userId);
        Task<Conversation?> UpdateReadConversation(string conversationId, string userId);
        Task<Conversation?> GetById(string conversationId);
        Task<Conversation?> GetDmConversationByUserIds(string firstUserId, string secondUserId);
        Task<PagedResult<GetPaginatedConversationsDto>> GetPaginatedByUserId(string userId, int pageNumber, int pageSize);
    }
}
