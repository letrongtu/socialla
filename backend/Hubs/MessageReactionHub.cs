using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class MessageReactionHub : Hub
    {
        // public async Task SendCreateMessageReaction(MessageReaction messageReaction){
        //     await Clients.All.SendAsync("ReceiveMessageReactionCreate", messageReaction);
        // }
        // public async Task SendDeleteMessageReaction(MessageReaction messageReaction){
        //     await Clients.All.SendAsync("ReceiveMessageReactionDelete", messageReaction);
        // }
        // public async Task SendUpdateMessageReaction(MessageReaction messageReaction){
        //     await Clients.All.SendAsync("ReceiveMessageReactionUpdate", messageReaction);
        // }

        public async Task SendMessageReactionChange(string messageId){
            await Clients.All.SendAsync("ReceiveMessageReactionChange", messageId);
        }
    }
}
