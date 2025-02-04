using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Comment
{
    public class CreateCommentDto
    {
        public string[] Content { get; set; } = [];
        public string? ParentCommentId;
        public string UserId { get; set; } = string.Empty;
        public string PostId { get; set; } = string.Empty;
    }
}
