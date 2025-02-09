using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class FriendshipHub : Hub
    {
        public async Task SendCreateFriendship(string firstCreatedUserId, string secondCreatedUserId){
            await Clients.All.SendAsync("ReceiveFriendshipCreate", firstCreatedUserId, secondCreatedUserId);
        }
        public async Task SendUpdateFriendship(string firstUpdatedUserId, string secondUpdatedUserId){
            await Clients.All.SendAsync("ReceiveFriendshipUpdate", firstUpdatedUserId, secondUpdatedUserId);
        }
        public async Task SendDeleteFriendship(string firstDeletedUserId, string secondDeletedUserId){
            await Clients.All.SendAsync("ReceiveFriendshipDelete", firstDeletedUserId, secondDeletedUserId);
        }
    }
}
