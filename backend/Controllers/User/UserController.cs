using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public UserController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id){
            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == id);

            // Handle null case
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Return user
            return Ok(user);
        }
    }
}
