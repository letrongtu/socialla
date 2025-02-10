using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendCreateNotification(Notification notification){
            await Clients.All.SendAsync("ReceiveNotificationCreate", notification);
        }
        public async Task SendUpdateNotification(string notificationId, bool isRead){
            await Clients.All.SendAsync("ReceiveNotificationUpdate", notificationId, isRead);
        }
        public async Task SendDeleteNotification(string notificationId){
            await Clients.All.SendAsync("ReceiveNotificationDelete", notificationId);
        }
    }
}
