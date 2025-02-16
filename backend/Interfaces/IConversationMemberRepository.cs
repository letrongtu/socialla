using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ConversationMember;
using backend.Models;

namespace backend.Interfaces
{
    public interface IConversationMemberRepository
    {
        Task<ConversationMember> CreateAsync(ConversationMember conversationMember);
        Task<ConversationMember?> DeleteAsync(DeleteConversationMemberDto conversationMemberDto);
        Task<ConversationMember?> UpdateDeleteTimeAsync(UpdateConversationMemberDto conversationMemberDto);
        Task<List<ConversationMember>> GetByConversationId(string conversationId);
    }
}
