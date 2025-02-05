using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class CommentReaction
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().ToLower();
        public string Reaction { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string UserId { get; set; } = string.Empty;
        public string PostId { get; set; } = string.Empty;
        public string CommentId { get; set; } = string.Empty;

    }
}
