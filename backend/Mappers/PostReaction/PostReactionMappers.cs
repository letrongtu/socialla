using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PostReaction;
using backend.Dtos.User;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Mappers.PostReaction
{
    public static class PostReactionMappers
    {
        public static backend.Models.PostReaction ToPostReactionFromCreate(this CreatePostReactionDto postReactionDto){
            return new backend.Models.PostReaction {
                Reaction = postReactionDto.Reaction,
                CreatedAt = DateTime.Now,
                UserId = postReactionDto.UserId,
                PostId = postReactionDto.PostId,
            };
        }
    }

}
