using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Comment;

namespace backend.Mappers.Comment
{
    public static class CommentMappers
    {
        public static backend.Models.Comment ToCommentFromCreateCommentDto(this CreateCommentDto commentDto){
            return new backend.Models.Comment {
                Content = commentDto.Content,
                CreatedAt = DateTime.Now,
                ParentCommentId = commentDto.ParentCommentId,
                UserId = commentDto.UserId,
                PostId = commentDto.PostId,
            };
        }
    }
}
