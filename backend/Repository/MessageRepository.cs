using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IMessageVisibilityRepository _messageVisibilityRepo;
        private readonly IHubContext<MessageHub> _hubContext;
        public MessageRepository(ApplicationDBContext dbContext,IMessageVisibilityRepository messageVisibilityRepo, IHubContext<MessageHub> hubContext)
        {
            _dbContext = dbContext;
            _messageVisibilityRepo = messageVisibilityRepo;
            _hubContext = hubContext;
        }

        public async Task<Message> CreateAsync(Message message)
        {
            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageCreate", message);

            return message;
        }

        public async Task<Message?> DeleteAsync(string messageId)
        {
            var existingMessage = await _dbContext.Messages.FindAsync(messageId);

            if(existingMessage == null){
                return null;
            }

            _dbContext.Messages.Remove(existingMessage);

            var allMessageVisibilities = await _dbContext.MessageVisibilities.Where((mv) => mv.MessageId == existingMessage.Id).ToListAsync();

            _dbContext.MessageVisibilities.RemoveRange(allMessageVisibilities);

            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageDelete", existingMessage);

            return existingMessage;
        }

        public async Task<Message?> GetById(string messageId){
            return await _dbContext.Messages.FindAsync(messageId);
        }

        public async Task<PagedResult<Message>> GetPaginatedByConversationIdAndUserId(string conversationId, string userId, int pageNumber, int pageSize)
        {
            var query = _dbContext.Messages.Where((m) => m.ConversationId == conversationId
                                                    && _dbContext.MessageVisibilities.Any(mv => mv.MessageId == m.Id
                                                                                        && mv.ConversationId == conversationId
                                                                                        && mv.UserId == userId ));

            var totalRecords = await query.CountAsync();

            var pagedMessages = await query
                        .OrderByDescending(m => m.CreatedAt)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

            //For display
            var sortedPagedMessages = pagedMessages.OrderBy(m => m.CreatedAt).ToList();

            return new PagedResult<Message> {
                Records = sortedPagedMessages,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
