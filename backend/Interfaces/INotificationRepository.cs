using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;

namespace backend.Interfaces
{
    public interface INotificationRepository
    {
        Task<Notification> CreateAsync(Notification notification);
        Task<Notification?> DeleteAsync(string notificationId);
        Task<Notification?> UpdateReadStatusAsync(string id, bool isRead);
        Task<PagedResult<Notification>> GetPaginatedByUserIdAsync(string userId, int pageNumber, int pageSize);
        Task<Notification?> GetUserNotificationByEntityIdReceiveUserIdEntityTypeAndTypeAsync(string entityId, string receiveUserId, NotificationEntityType entityType, NotificationType type);
    }
}
