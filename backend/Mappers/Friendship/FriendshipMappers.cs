using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Friendship;

namespace backend.Mappers.Friendship
{
    public static class FriendshipMappers
    {
        public static backend.Models.Friendship ToFriendshipFromCreateFriendshipDto(this CreateFriendshipDto friendshipDto){
            return new backend.Models.Friendship {
                FirstUserId = friendshipDto.FirstUserId,
                SecondUserId = friendshipDto.SecondUserId,
                Status = Models.FriendshipStatus.Pending,
                CreatedAt = DateTime.Now,
            };
        }
    }
}
