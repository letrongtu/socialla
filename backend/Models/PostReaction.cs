using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class PostReaction
    {
        public int Id { get; set; }
        public string Reaction { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string UserId { get; set; } = string.Empty;
        public int PostId { get; set; }
    }
}
