using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;

namespace backend.Dtos.CommentReaction
{
    public class ReturnCommentReactionDto
    {
        public string Reaction { get; set; } = string.Empty;
        public int Count { get; set; } = 0;
        public List<ReturnUserForReactionDto> Users { get; set; } = [];
    }
}
