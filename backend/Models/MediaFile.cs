using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MediaFile
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public byte[] Data { get; set; } = [];
        public string ContentType { get; set; } = string.Empty;
    }
}
