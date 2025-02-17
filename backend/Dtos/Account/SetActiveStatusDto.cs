using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    public class SetActiveStatusDto
    {
        public string UserId { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
