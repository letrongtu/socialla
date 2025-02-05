using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.CommentReaction;

namespace backend.Mappers.CommentReaction
{
    public static class CommentReactionMappers
    {
        public static backend.Models.CommentReaction ToCommentReactionFromCreate(this CreateCommentReactionDto commentReactionDto){
            return new backend.Models.CommentReaction {
                Reaction = commentReactionDto.Reaction,
                CreatedAt = DateTime.Now,
                UserId = commentReactionDto.UserId,
                PostId = commentReactionDto.PostId,
                CommentId = commentReactionDto.CommentId
            };
        }
    }
}
