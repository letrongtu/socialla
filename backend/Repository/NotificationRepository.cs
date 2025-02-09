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

            await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationDelete", existingNotification.Id);

            return existingNotification;
        }

        public async Task<Notification?> UpdateReadAsync(string notificationId)
        {
            var existingNotification = await _dbContext.Notifications.FindAsync(notificationId);

            if(existingNotification == null){
                return null;
            }

            existingNotification.IsRead = true;
            await _dbContext.SaveChangesAsync();

            await _notificationHubContext.Clients.All.SendAsync("ReceiveNotificationUpdate", existingNotification.Id);

            return existingNotification;
        }

        public async Task<PagedResult<Notification>> GetPaginatedByUserIdAsync(string userId, int pageNumber, int pageSize)
        {
            var userNotifications = await _dbContext.Notifications.Where((notification) => notification.ReceiveUserId == userId).ToListAsync();

            var totalRecords = userNotifications.Count;

            var paginatedUserNotifications = userNotifications
                                            .OrderByDescending((notifcation) => notifcation.CreatedAt)
                                            .Skip((pageNumber - 1) * pageSize)
                                            .Take(pageSize)
                                            .ToList();

            return new PagedResult<Notification>{
                Records = paginatedUserNotifications,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
            };
        }
    }
}
