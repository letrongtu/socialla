using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Friendship
{
    public class UpdateAcceptFriendshipDto
    {
        public string FirstUserId { get; set; } = string.Empty;
        public string SecondUserId { get; set; } = string.Empty;
    }
}
