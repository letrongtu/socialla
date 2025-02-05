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
        public async Task SendCommentReactionCreate(CommentReaction reaction){
            await Clients.All.SendAsync("ReceiveCommentReactionCreate", reaction);
        }
        public async Task SendCommentReactionDelete(CommentReaction reaction){
            await Clients.All.SendAsync("ReceiveCommentReactionDelete", reaction);
        }
        public async Task SendCommentReactionUpdate(CommentReaction reaction){
            await Clients.All.SendAsync("ReceiveCommentReactionUpdate", reaction);
        }
    }
}
