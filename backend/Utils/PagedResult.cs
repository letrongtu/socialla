using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Utils
{
    public class PagedResult<T>
    {
        public List<T> Records { get; set; } = new List<T>();
        public int TotalRecords { get; set; }
        public int? TotalPostCommentRecords { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(decimal.Divide(TotalRecords, PageSize));
        public bool HasNextPage => PageNumber < TotalPages;
        public bool HasPreviousPage => PageNumber > 1;
    }
}
