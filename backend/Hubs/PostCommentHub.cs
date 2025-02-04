using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class PostCommentHub : Hub
    {
        public async Task SendCreateComment(Comment comment){
            await Clients.All.SendAsync("ReceivePostCommentCreate", comment);
        }

        public async Task SendUpdateComment(Comment updatedComment){
            await Clients.All.SendAsync("ReceivePostCommentUpdate", updatedComment);
        }
    }
}
