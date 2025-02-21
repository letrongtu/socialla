using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendCreateMessage(Message message){
            await Clients.All.SendAsync("ReceiveMessageCreate", message);
        }
        public async Task SendDeleteMessage(Message message){
            await Clients.All.SendAsync("ReceiveMessageDelete", message);
        }

        public async Task SendDeleteMessageVisibility(string messageId, string userId, string conversationId){
            await Clients.All.SendAsync("ReceiveMessageVisibilityDelete", messageId, userId, conversationId);
        }
    }
}
