using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Friendship;
using backend.Interfaces;
using backend.Mappers.Friendship;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Friendship
{
    [Route("api/friendship")]
    [ApiController]
    public class FriendshipController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IFriendshipRepository _friendshipRepo;
        public FriendshipController(UserManager<AppUser> userManager, IFriendshipRepository friendshipRepo)
        {
            _userManager = userManager;
            _friendshipRepo = friendshipRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateFriendshipDto friendshipDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var sender = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.FirstUserId);
            if(sender == null){
                return StatusCode(400, "Sender User not found");
            }

            var receiver = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.SecondUserId);
            if(receiver == null){
                return StatusCode(400, "Receiver User not found");
            }

            var existingFriendship = await _friendshipRepo.CheckFriendshipAsync(friendshipDto.FirstUserId, friendshipDto.SecondUserId);

            if(existingFriendship != null){
                return StatusCode(400, "Users are friends already");
            }

            var friendship = friendshipDto.ToFriendshipFromCreateFriendshipDto();

            await _friendshipRepo.CreateAsync(friendship);

            return Ok(new {Message = "Request sent", SendUserId = friendship.FirstUserId, ReceiveUserId = friendship.SecondUserId});
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(DeleteFriendshipDto friendshipDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var sender = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.FirstUserId);
            if(sender == null){
                return StatusCode(400, "Sender User not found");
            }

            var receiver = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.SecondUserId);
            if(receiver == null){
                return StatusCode(400, "Receiver User not found");
            }

            var deletedFriendship = await _friendshipRepo.DeleteAsync(friendshipDto);

            if(deletedFriendship == null){
                return NotFound("The friendship not found");
            }

            return Ok(new {Message = "Friend removed", SendUserId = deletedFriendship.FirstUserId, ReceiveUserId = deletedFriendship.SecondUserId});
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> AcceptRequest(UpdateAcceptFriendshipDto friendshipDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var sender = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.FirstUserId);
            if(sender == null){
                return StatusCode(400, "Sender User not found");
            }

            var receiver = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.SecondUserId);
            if(receiver == null){
                return StatusCode(400, "Receiver User not found");
            }

            var updatedFriendship = await _friendshipRepo.UpdateAcceptAsync(friendshipDto);

            if(updatedFriendship == null){
                return NotFound("The friendship not found");
            }

            return Ok(new {Message = "Request accepted", SendUserId = updatedFriendship.FirstUserId, ReceiveUserId = updatedFriendship.SecondUserId});
        }

        [HttpGet]
        [Route("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetAllByUserId([FromRoute] string userId){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == userId);
            if(user == null){
                return StatusCode(400, "User not found");
            }

            var userFriends = await _friendshipRepo.GetAllByUserIdAsync(userId);

            var userFriendIds = userFriends.Select(friend => friend.FirstUserId == userId ? friend.SecondUserId : friend.FirstUserId).ToList();

            return Ok(new {userFriendIds = userFriendIds});
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> CheckFriendship(CheckFriendshipDto friendshipDto){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var firstUser = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.FirstUserId);
            if(firstUser == null){
                return StatusCode(400, "First User not found");
            }

            var secondUser = await _userManager.Users.FirstOrDefaultAsync((u) => u.Id == friendshipDto.SecondUserId);
            if(secondUser == null){
                return StatusCode(400, "Second User not found");
            }

            var friendship = await _friendshipRepo.CheckFriendshipAsync(friendshipDto.FirstUserId, friendshipDto.SecondUserId);

            return Ok(new {isFriend = friendship != null});
        }

    }
}
