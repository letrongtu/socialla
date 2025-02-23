using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.MessageReaction
{
    public class CreateMessageReactionDto
    {
        public string Reaction { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
    }
}
