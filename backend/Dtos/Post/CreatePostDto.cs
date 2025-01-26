using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Post
{
    public class CreatePostDto
    {
        public string[]? Content { get; set; } = [];
        public string? Feeling { get; set; } = string.Empty;
        public string PostAudience { get; set; } = string.Empty;
        public string[]? FileUrls { get; set; } = [];
        public string UserId { get; set; } = string.Empty;
    }
}
