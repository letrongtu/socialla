using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.ConversationMember;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ConversatioMemberRepository : IConversationMemberRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public ConversatioMemberRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ConversationMember> CreateAsync(ConversationMember conversationMember)
        {
            await _dbContext.ConversationMembers.AddAsync(conversationMember);
            await _dbContext.SaveChangesAsync();

            return conversationMember;
        }

        public async Task<ConversationMember?> DeleteAsync(DeleteConversationMemberDto conversationMemberDto)
        {
            var existingConversationMember = await _dbContext.ConversationMembers.FirstOrDefaultAsync((cm) =>
                                                cm.ConversationId == conversationMemberDto.ConversationId
                                                && cm.UserId == conversationMemberDto.UserId);

            if(existingConversationMember == null){
                return null;
            }

            _dbContext.ConversationMembers.Remove(existingConversationMember);
            await _dbContext.SaveChangesAsync();

            return existingConversationMember;
        }

        public async Task<ConversationMember?> UpdateDeleteTimeAsync(UpdateConversationMemberDto conversationMemberDto)
        {
            var existingConversationMember = await _dbContext.ConversationMembers.FirstOrDefaultAsync((cm) =>
                                                cm.ConversationId == conversationMemberDto.ConversationId
                                                && cm.UserId == conversationMemberDto.UserId);

            if(existingConversationMember == null){
                return null;
            }

            existingConversationMember.DeletedConversationAt = DateTime.Now;
            await _dbContext.SaveChangesAsync();

            return existingConversationMember;
        }

        public async Task<List<ConversationMember>> GetByConversationId(string conversationId)
        {
            var existingConversationMember = await _dbContext.Conversations.FindAsync(conversationId);

            if(existingConversationMember == null){
                return [];
            }

            return await _dbContext.ConversationMembers.Where(cm => cm.ConversationId == conversationId).ToListAsync();
        }
    }
}
