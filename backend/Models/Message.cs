using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().ToLower();
        public string ConversationId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string[] Content { get; set; } = [];
        public string[]? FileUrls { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
