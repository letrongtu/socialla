using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class UserStatusHub : Hub
    {
        public async Task SendUserOnline(string userId){
            await Clients.All.SendAsync("ReceiveUserOnline", userId);
        }

        public async Task SendUserOffline(string userId, DateTime lastActiveAt){
            await Clients.All.SendAsync("ReceiveUserOffline", userId, lastActiveAt);
        }
    }
}
