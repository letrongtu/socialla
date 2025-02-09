using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Notification
{
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
        public async Task<IActionResult> UpdateRead(string id){
            if(!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            var updatedNotification = await _notificationRepo.UpdateReadAsync(id);

            if(updatedNotification == null){
                return NotFound("Notification not found");
            }

            return Ok(new {Message = "Nofitication updated", notificationId = updatedNotification.Id});
        }

        [HttpGet]
        [Route("userId")]
        public async Task<IActionResult> GetPaginatedByUserId(string userId, int pageNumber, int pageSize){
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

            var paginatedNotifications = await _notificationRepo.GetPaginatedByUserIdAsync(userId, pageNumber, pageSize);

            return Ok(new {Notifications = paginatedNotifications.Records, TotalNotifications = paginatedNotifications.TotalRecords, HasNextPage = paginatedNotifications.HasNextPage});
        }
    }
}
