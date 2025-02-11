using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Notification
{
    //TODO: Authorize
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly INotificationRepository _notificationRepo;
        public NotificationController(UserManager<AppUser> userManager, INotificationRepository notificationRepo)
        {
            _userManager = userManager;
            _notificationRepo = notificationRepo;
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(string id){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var deletedNotification = await _notificationRepo.DeleteAsync(id);

            if(deletedNotification == null){
                return NotFound("Notification not found");
            }

            return Ok(new {Message = "Nofitication deleted", notificationId = deletedNotification.Id});
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReadStatus(string id, [FromQuery] bool isRead){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var updatedNotification = await _notificationRepo.UpdateReadStatusAsync(id, isRead);

            if(updatedNotification == null){
                return NotFound("Notification not found");
            }

            return Ok(new {Message = "Nofitication updated", notificationId = updatedNotification.Id});
        }

        [HttpGet]
        [Route("{userId}")]
        // [Authorize]
        public async Task<IActionResult> GetPaginatedByUserId([FromRoute] string userId, [FromQuery] bool isFetchingUnread = false, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync((user) => user.Id == userId);

            if(user == null){
                return NotFound("User not found");
            }

            if(pageNumber < 1 || pageSize < 1){
                return BadRequest("Page number and page size must be greater than 0");
            }

            var paginatedNotifications = await _notificationRepo.GetPaginatedByUserIdAsync(userId, pageNumber, pageSize, isFetchingUnread);

            return Ok(new {Notifications = paginatedNotifications.Records, TotalNotifications = paginatedNotifications.TotalRecords, HasNextPage = paginatedNotifications.HasNextPage});
        }
    }
}
