using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers.User;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.User
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly UserManager<AppUser> _userManager;
        public readonly IFriendshipRepository _friendshipRepo;
        private readonly IHubContext<UserStatusHub> _hubContext;
        public UserController(UserManager<AppUser> userManager, IFriendshipRepository friendshipRepo, IHubContext<UserStatusHub> hubContext)
        {
            _userManager = userManager;
            _friendshipRepo = friendshipRepo;
            _hubContext = hubContext;
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

        [HttpPost("active")]
        public async Task<IActionResult> SetIsActive([FromBody] SetActiveStatusDto statusDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(statusDto.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.IsActive = statusDto.IsActive;

            // Going offline
            if(user.IsActive && !statusDto.IsActive){
                user.LastActiveAt = DateTime.Now;

                await _hubContext.Clients.All.SendAsync("ReceiveUserOffline", user.Id, user.LastActiveAt);
            }

            // Going online
            if(!user.IsActive && statusDto.IsActive){
                user.LastActiveAt = null;

                await _hubContext.Clients.All.SendAsync("ReceiveUserOnline", user.Id);
            }

            await _userManager.UpdateAsync(user);

            return Ok(new {Message = "User status updated"});
        }
    }
}
