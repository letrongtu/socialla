using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.MessageVisibility
{
    public class DeleteMessageVisibilityDto
    {
        public string ConversationId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }
}
