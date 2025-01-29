using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.PostReaction
{
    public class CreatePostReactionDto
    {
        public string Reaction { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public int PostId { get; set; }
    }
}
