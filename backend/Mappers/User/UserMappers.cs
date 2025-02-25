using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Mappers.User
{
    public static class UserMappers
    {
        public static ReturnCurrentUserDto ToReturnCurrentUserDto(this AppUser appUser){

            return new ReturnCurrentUserDto{
                Id = appUser.Id,
                FirstName = appUser.FirstName,
                LastName = appUser.LastName,
                DateOfBirth = appUser.DateOfBirth,
                Email = appUser.Email,
                ProfilePictureUrl = appUser.ProfilePictureUrl,
                CreatedAt = appUser.CreatedAt,
                PhoneNumber = appUser.PhoneNumber,
                IsActive = appUser.IsActive,
                LastActiveAt = appUser.LastActiveAt,
            };
        }

        public static ReturnUserForReactionDto ToReturnUserForReactionDto (this AppUser appUser){
            return new ReturnUserForReactionDto{
                Id = appUser.Id,
                FullName = appUser.FirstName + " " + appUser.LastName,
            };
        }
    }
}
