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
        Task<List<Notification>?> UpdateMultipleReadStatusAsync(List<string> ids);
        Task<PagedResult<Notification>> GetPaginatedByUserIdAsync(string userId , int pageNumber, int pageSize, bool isFetchingUnRead = false);
        Task<Notification?> GetUserNotificationByEntityIdReceiveUserIdEntityTypeAndTypeAsync(string entityId, string receiveUserId, NotificationEntityType entityType, NotificationType type);
    }
}
