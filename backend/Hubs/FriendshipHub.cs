using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class FriendshipHub : Hub
    {
        public async Task SendUpdateFriendship(string firstUserId, string secondUserId){
            await Clients.All.SendAsync("ReceiveFriendshipUpdate", firstUserId, secondUserId);
        }
        public async Task SendDeleteFriendship(string firstUserId, string secondUserId){
            await Clients.All.SendAsync("ReceiveFriendshipDelete", firstUserId, secondUserId);
        }
    }
}
