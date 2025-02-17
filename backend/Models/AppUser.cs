using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string ProfilePictureUrl { get; set; } = string.Empty;
        public Boolean IsActive { get; set; } = false;
        public DateTime? LastActiveAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
