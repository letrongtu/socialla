using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PostReaction;

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

        public static ReturnPostReationDto ToReturnPostReactionDto(this backend.Models.PostReaction postReaction){
            return new ReturnPostReationDto {
                Reaction = postReaction.Reaction,
                Count = 1,
                UserIds = new List<string> { postReaction.UserId },
                PostId = postReaction.PostId,
            };
        }
    }

}
