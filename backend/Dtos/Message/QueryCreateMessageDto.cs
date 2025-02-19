using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Message
{
    public class QueryCreateMessageDto
    {
        public List<string>? UserIds { get; set; }
        public string? ConversationId { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public string? ParentMessageId { get; set; }
        public string[] Content { get; set; } = [];
        public string[]? FileUrls { get; set; }
        public Boolean IsEmojiOnly { get; set; }
    }
}
