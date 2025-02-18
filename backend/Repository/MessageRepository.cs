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
        private readonly IHubContext<MessageHub> _hubContext;
        public MessageRepository(ApplicationDBContext dbContext, IHubContext<MessageHub> hubContext)
        {
            _dbContext = dbContext;
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
            await _dbContext.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveMessageDelete", existingMessage);

            return existingMessage;
        }

        public async Task<Message?> GetById(string messageId){
            return await _dbContext.Messages.FindAsync(messageId);
        }

        public async Task<PagedResult<Message>> GetPaginatedByConversationId(string conversationId, int pageNumber, int pageSize)
        {
            var query = _dbContext.Messages.Where((m) => m.ConversationId == conversationId);

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
