using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class PostHub : Hub
    {
        public async Task SendCreatePost(Post post){
            await Clients.All.SendAsync("ReceivePostCreate", post);
        }
        public async Task SendUpdatePost(Post updatedPost){
            await Clients.All.SendAsync("ReceivePostUpdate", updatedPost);
        }
        public async Task SendDeletePost(Post deletedPost){
            await Clients.All.SendAsync("ReceivePostDelete", deletedPost);
        }
    }
}
