using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Post;
using backend.Models;
using Humanizer;

namespace backend.Mappers.Post
{
    public static class PostMappers
    {
        public static backend.Models.Post ToPostFromCreate(this CreatePostDto postDto){
            return new Models.Post {
                Content = postDto.Content,
                Feeling = postDto.Feeling,
                PostAudience = postDto.PostAudience,
                FileUrls = postDto.FileUrls,
                UserId = postDto.UserId,
            };
        }
    }
}
