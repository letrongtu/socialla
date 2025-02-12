using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Mappers.User;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.User
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly UserManager<AppUser> _userManager;
        public readonly IFriendshipRepository _friendshipRepo;
        public UserController(UserManager<AppUser> userManager, IFriendshipRepository friendshipRepo)
        {
            _userManager = userManager;
            _friendshipRepo = friendshipRepo;
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user.ToReturnCurrentUserDto());
        }

        [HttpGet]
        [Route("search")]
        [Authorize]
        public async Task<IActionResult> SearchUsers([FromQuery] string query, [FromQuery] string userId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty.");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var usersList = await _userManager.Users
                .Where(user => (user.FirstName + " " + user.LastName).Contains(query))
                .Select(user => new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    FullName = user.FirstName + " " + user.LastName,
                    user.ProfilePictureUrl
                })
                .Take(10)
                .ToListAsync();

            var usersWithDetails = new List<object>();
            foreach (var u in usersList)
            {
                var mutualFriendsCount = await _friendshipRepo.GetMutualFriendCountAsync(userId, u.Id);
                var isFriend = await _friendshipRepo.CheckFriendshipAsync(userId, u.Id);

                usersWithDetails.Add(new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.FullName,
                    u.ProfilePictureUrl,
                    IsFriend = isFriend?.Status == FriendshipStatus.Accepted,
                    MutualFriendsCount = mutualFriendsCount,
                });
            }

            return Ok(new {Results = usersWithDetails});
        }
    }
}
