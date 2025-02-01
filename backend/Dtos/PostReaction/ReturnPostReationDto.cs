using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;

namespace backend.Dtos.PostReaction
{
    public class ReturnPostReationDto
    {
        public string Reaction { get; set; } = string.Empty;
        public int Count { get; set; } = 0;
        public List<ReturnUserForPostReactionDto> Users { get; set; } = [];
    }
}
