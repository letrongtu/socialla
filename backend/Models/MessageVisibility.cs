using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MessageVisibility
    {
        public string ConversationId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
    }
}
