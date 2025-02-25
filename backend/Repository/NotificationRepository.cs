using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        public NotificationRepository(ApplicationDBContext dbContext, IHubContext<NotificationHub> notificationHubContext)
        {
            _dbContext = dbContext;
            _notificationHubContext = notificationHubContext;
        }


        public async Task<Notification> CreateAsync(Notification notification)
        {
            var existingUserNotifications = await _dbContext.Notifications
                                                        .Where((notifi) =>
                                                                (notifi.Type == NotificationType.Friend_Request || notifi.Type == NotificationType.Friend_Accept // For friend accept or request
                                                                || (notifi.Type == NotificationType.React_Post && notifi.PostId == notification.PostId) // For post reactions if user modifies or deletes then creates a new reaction
                                                                || (notifi.Type == NotificationType.Comment_Created && notifi.PostId == notification.PostId) // For post comments
                                                                )
                                                                && notifi.EntityType == notification.EntityType
                                                                && (notifi.EntityId == notification.EntityId || notifi.EntityId == notification.ReceiveUserId)
                                                                && (notifi.ReceiveUserId == notification.ReceiveUserId || notifi.ReceiveUserId == notification.EntityId))
                                                        .ToListAsync();

            if(existingUserNotifications != null){
                foreach(var existingUserNotification in existingUserNotifications){
                    _dbContext.Notifications.Remove(existingUserNotification);
                    await _dbContext.SaveChangesAsync();
                    await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationDelete", existingUserNotification);
                }

            }
            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationCreate", notification);

            return notification;
        }

        public async Task<Notification?> DeleteAsync(string notificationId)
        {
            var existingNotification = await _dbContext.Notifications.FindAsync(notificationId);

            if(existingNotification == null){
                return null;
            }

            _dbContext.Notifications.Remove(existingNotification);
            await _dbContext.SaveChangesAsync();

            await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationDelete", existingNotification);

            return existingNotification;
        }

        public async Task<Notification?> UpdateReadStatusAsync(string id, bool isRead)
        {
            var existingNotification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (existingNotification == null)
            {
                return null;
            }

            existingNotification.IsRead = isRead;
            await _dbContext.SaveChangesAsync();

            await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationUpdate", existingNotification);

            return existingNotification;
        }

        public async Task<List<Notification>?> UpdateMultipleReadStatusAsync(List<string> ids)
        {
            var notifications = await _dbContext.Notifications
                .Where(n => ids.Contains(n.Id))
                .ToListAsync();

            if (notifications.Count == 0)
            {
                return null;
            }

            foreach(var notification in notifications){
                notification.IsRead = true;
                await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationUpdate", notification);
            }

            await _dbContext.SaveChangesAsync();

            return notifications;
        }

        public async Task<PagedResult<Notification>> GetPaginatedByUserIdAsync(string userId , int pageNumber, int pageSize, bool isFetchingUnRead = false)
        {
            var query = _dbContext.Notifications.Where((notification) => notification.ReceiveUserId == userId);

            if(isFetchingUnRead){
                query = query.Where((notification) => notification.IsRead == false);
            }

            var paginatedUserNotifications = await query
                                            .OrderByDescending((notifcation) => notifcation.CreatedAt)
                                            .Skip((pageNumber - 1) * pageSize)
                                            .Take(pageSize)
                                            .ToListAsync();

            var totalRecords = await query.CountAsync();

            return new PagedResult<Notification>{
                Records = paginatedUserNotifications,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
            };
        }

        public async Task<Notification?> GetUserNotificationByEntityIdReceiveUserIdEntityTypeAndTypeAsync(string entityId, string receiveUserId, NotificationEntityType entityType, NotificationType type)
        {
            return await _dbContext.Notifications.FirstOrDefaultAsync((notification) => notification.EntityId == entityId
                                                                        && notification.EntityType == entityType
                                                                        && notification.ReceiveUserId == receiveUserId
                                                                        &&notification.Type == type);
        }
    }
}
