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
        public async Task SendUpdateNotification(Notification notification){
            await Clients.All.SendAsync("ReceiveNotificationUpdate", notification);
        }
        public async Task SendDeleteNotification(Notification notification){
            await Clients.All.SendAsync("ReceiveNotificationDelete", notification);
        }
    }
}
