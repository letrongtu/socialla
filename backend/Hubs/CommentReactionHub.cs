using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class CommentReactionHub : Hub
    {
        public async Task SendCommentReactionChange(string commentId){
            await Clients.All.SendAsync("ReceiveCommentReactionChange", commentId);
        }
    }
}
