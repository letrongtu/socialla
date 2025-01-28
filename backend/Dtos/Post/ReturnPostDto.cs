using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Post
{
    public class ReturnPostDto
    {
        public int Id {get; set;}
        public string[]? Content { get; set; } = [];
        public string? Feeling { get; set; }
        public string PostAudience { get; set; } = string.Empty;
        public string[]? FileUrls { get; set; } = [];
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}
