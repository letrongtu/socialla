using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Comment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().ToLower();
        public string[] Content { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
        public string? ParentCommentId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string PostId { get; set; } = string.Empty;
    }
}
