using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.PostReaction
{
    public class ReturnPostReationDto
    {
        public string Reaction { get; set; } = string.Empty;
        public int Count { get; set; } = 0;
        public List<string> UserIds { get; set; } = [];
        public int PostId { get; set; }
    }
}
