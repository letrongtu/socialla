using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Notification
{
    public class UpdateNotificationsDto
    {
        public List<string> Ids { get; set; } = new List<string>();
    }
}
