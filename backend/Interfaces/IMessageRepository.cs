using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMessageRepository
    {
        Task<Message> CreateAsync(Message message);
        Task<Message?> DeleteAsync(string messageId);
        Task<Message?> GetById(string messageId);
    }
}
