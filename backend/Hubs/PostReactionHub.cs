using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class PostReactionHub : Hub
    {
        public async Task SendPostReactionChange(string postId){
            await Clients.All.SendAsync("ReceivePostReactionChange", postId);
        }
    }
}
