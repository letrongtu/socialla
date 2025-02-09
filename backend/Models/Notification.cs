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
        public string Id = Guid.NewGuid().ToString().ToLower();
        public string ReceiveUserId = string.Empty;
        public NotificationEntityType EntityType = NotificationEntityType.Null;
        public string EntityId = string.Empty; // The one who triggers the notification
        public NotificationType Type = NotificationType.Null;
        public string Content = string.Empty;
        public Boolean IsRead = false;
        public DateTime CreatedAt = DateTime.Now;
    }
}
