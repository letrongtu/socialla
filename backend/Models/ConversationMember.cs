using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ConversationMember
    {
        public string ConversationId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime? DeletedConversationAt { get; set; }
        public DateTime JoinAt { get; set; } = DateTime.Now;
    }
}
