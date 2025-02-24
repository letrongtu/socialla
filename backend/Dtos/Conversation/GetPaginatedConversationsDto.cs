using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Conversation
{
    public class GetPaginatedConversationsDto
    {
        public required backend.Models.Conversation Conversation { get; set; }

        public backend.Models.AppUser? OtherUser { get; set; }

        public backend.Models.Message? LastMessage { get; set; }
        public bool IsLastMessageRead { get; set; }
    }
}
