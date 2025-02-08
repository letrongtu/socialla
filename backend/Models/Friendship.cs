using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public enum FriendshipStatus {
        Pending,
        Accepted
    }
    public class Friendship
    {
        public string FirstUserId { get; set; } = string.Empty;
        public string SecondUserId { get; set; } = string.Empty;
        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? AcceptedAt { get; set; }
    }
}
