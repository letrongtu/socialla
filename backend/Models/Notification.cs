using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public enum NotificationType {
        Null,
        Friend_Request,
        Friend_Accept,
        React_Post,
        Comment_Post,
        React_Comment,
        Reply_Comment
        //TODO: Tag
    }
    public enum NotificationEntityType {
        Null,
        Post,
        Comment,
        User
    }
    public class Notification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().ToLower();
        public string ReceiveUserId { get; set; } = string.Empty;
        public NotificationEntityType EntityType { get; set; } = NotificationEntityType.Null;
        public string EntityId { get; set; } = string.Empty; // The one who triggers the notification
        public NotificationType Type { get; set; } = NotificationType.Null;
        public string Content { get; set; } = string.Empty;
        public Boolean IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
