using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Validators
{
    public class CustomUserValidator<TUser> : UserValidator<TUser> where TUser : IdentityUser
    {
        public override async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user)
        {
            var baseResult = await base.ValidateAsync(manager, user);

            if (!string.IsNullOrEmpty(user.UserName) && user.UserName.Contains(' '))
            {
                return IdentityResult.Success;
            }

            if (!baseResult.Succeeded)
            {
                return baseResult;
            }

            return IdentityResult.Success;
        }
    }
}
