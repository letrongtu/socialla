using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ConversationHub : Hub
    {
        public async Task SendCreateConversation(string conversationId, string[] userIds){
            await Clients.All.SendAsync("ReceiveConversationCreate", conversationId, userIds);
        }

        public async Task SendDeleteConversation(string conversationId, string userId){
            await Clients.All.SendAsync("ReceiveConversationDelete", conversationId, userId);
        }

        public async Task SendUpdateReadConversation(string conversationId, string userId){
            await Clients.All.SendAsync("ReceiveConversationUpdateRead", conversationId, userId);
        }
    }
}
