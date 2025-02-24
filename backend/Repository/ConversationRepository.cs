using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Conversation;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMessageRepository _messageRepo;
        private readonly IHubContext<ConversationHub> _hubContext;
        public ConversationRepository(ApplicationDBContext dbContext, UserManager<AppUser> userManager, IMessageRepository messageRepo, IHubContext<ConversationHub> hubContext)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _messageRepo = messageRepo;
            _hubContext = hubContext;
        }

        public async Task<Conversation> CreateAsync(Conversation conversation)
        {
            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();

            return conversation;
        }

        public async Task<Conversation?> DeleteAsync(string convId, string userId)
        {
            var existingConversation = await _dbContext.Conversations.FindAsync(convId);

            if(existingConversation == null){
                return null;
            }

            var userConversationVisibilities = await _dbContext.MessageVisibilities.Where(mv => mv.ConversationId == convId && mv.UserId == userId).ToListAsync();

            var conversationVisibilitiesCount = await _dbContext.MessageVisibilities.Where(mv => mv.ConversationId == convId).CountAsync();

            // If no more user can see the conversation -> delete the messages from the db
            if(conversationVisibilitiesCount == userConversationVisibilities.Count){
                var messages = await _dbContext.Messages.Where(m => m.ConversationId == convId).ToListAsync();

                foreach(var message in messages){
                    await _messageRepo.DeleteAsync(message.Id);
                }

                await _dbContext.SaveChangesAsync();

                await _hubContext.Clients.All.SendAsync("ReceiveConversationDelete", convId, userId);

                return existingConversation;
            }

            _dbContext.MessageVisibilities.RemoveRange(userConversationVisibilities);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveConversationDelete", convId, userId);

            return existingConversation;
        }

        public async Task<Conversation?> UpdateReadConversation(string conversationId, string userId){
            var existingConversation = await _dbContext.Conversations.FindAsync(conversationId);

            if(existingConversation == null){
                return null;
            }

            var userUnReadVisibilities = await _dbContext.MessageVisibilities.Where(mv => mv.ConversationId == conversationId && mv.UserId == userId).ToListAsync();

            foreach(var userUnReadVisibility in userUnReadVisibilities){
                userUnReadVisibility.IsRead = true;
            }

            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveConversationUpdateRead", conversationId, userId);

            return existingConversation;
        }

        public async Task<Conversation?> GetById(string conversationId){
            return await _dbContext.Conversations.FindAsync(conversationId);
        }

        public async Task<Conversation?> GetDmConversationByUserIds(string firstUserId, string secondUserId)
        {
            return await _dbContext.Conversations
                .Where(c => !c.IsGroup) //Dm convo
                .Where(c => _dbContext.ConversationMembers
                    .Count(cm => cm.ConversationId == c.Id &&
                            (cm.UserId == firstUserId || cm.UserId == secondUserId)) == 2)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedResult<GetPaginatedConversationsDto>> GetPaginatedByUserId(string userId, int pageNumber, int pageSize){

            // Fetch user conversations with last messages and the other user
            var query = _dbContext.Conversations
                            .Where(c => _dbContext.ConversationMembers
                                .Where(cm => cm.UserId == userId)
                                .Select(cm => cm.ConversationId)
                                .Contains(c.Id))
                            // Check if the conversation is deleted on 1 side
                            .Where(c => _dbContext.MessageVisibilities
                                .Any(mv => mv.UserId == userId && mv.ConversationId == c.Id))
                            .Select(c => new GetPaginatedConversationsDto
                            {
                                Conversation = c,

                                OtherUser = _dbContext.Users
                                    .Where(u => _dbContext.ConversationMembers
                                        .Where(cm => cm.ConversationId == c.Id && cm.UserId != userId) // Exclude current user
                                        .Select(cm => cm.UserId)
                                        .Contains(u.Id))
                                    .FirstOrDefault(), // Get the other user

                                LastMessage = _dbContext.Messages
                                    .Where(m => m.ConversationId == c.Id)
                                    .OrderByDescending(m => m.CreatedAt)
                                    .FirstOrDefault(), // Get the last message

                                IsLastMessageRead = _dbContext.MessageVisibilities
                                    .Where(mv => mv.ConversationId == c.Id
                                                && mv.MessageId == _dbContext.Messages
                                                                    .Where(m => m.ConversationId == c.Id)
                                                                    .OrderByDescending(m => m.CreatedAt)
                                                                    .Select(m => m.Id).FirstOrDefault()
                                                && mv.UserId == userId)
                                    .Select(mv => mv.IsRead).FirstOrDefault()
                            });

            var totalRecords = await query.CountAsync();

            var paginatedOrderedConversations = await query
                                    .OrderByDescending(c => c.LastMessage != null ? c.LastMessage.CreatedAt : DateTime.MinValue)
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            return new PagedResult<GetPaginatedConversationsDto>{
                Records = paginatedOrderedConversations,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
            };
        }
    }
}
