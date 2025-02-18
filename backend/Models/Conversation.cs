using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Conversation
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().ToLower();
        public bool IsGroup { get; set; } = false;
        public string EmojiSlug { get; set; } = "thumps_up";
        public string? GroupName { get; set; }
        public string? GroupAvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
