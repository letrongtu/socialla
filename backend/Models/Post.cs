using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string[] Content { get; set; } = [];
        public string Feeling { get; set; } = string.Empty;
        public string PostAudience { get; set; } = string.Empty;
        public string[] ImageUrls { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}
