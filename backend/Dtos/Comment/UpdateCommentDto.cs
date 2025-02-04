using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Comment
{
    public class UpdateCommentDto
    {
        public string Id { get; set; } = string.Empty;
        public string[] Content { get; set; } = [];
    }
}
