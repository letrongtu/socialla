using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.CommentReaction
{
    public class DeleteCommentReactionDto
    {
        public string UserId { get; set; } = string.Empty;
        public string PostId { get; set; } = string.Empty;
        public string CommentId { get; set; } = string.Empty;
    }
}
