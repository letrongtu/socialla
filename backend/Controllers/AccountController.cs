using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto signUpDto){
            try{
                if(!ModelState.IsValid){
                    return BadRequest(FormatModelStateErrros());
                }

                if (!Regex.IsMatch(signUpDto.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                {
                    return StatusCode(400, "The email address is not valid.");
                }

                var existingUser = await _userManager.FindByEmailAsync(signUpDto.Email);
                if (existingUser != null)
                {
                    return StatusCode(400, "The email already exists");
                }

                var createdAt = DateTime.Now;
                var formattedCreatedAt = createdAt.ToString("yyyyMMddHHmmss");
                var uniqueUserName = signUpDto.Email.Split('@')[0] + formattedCreatedAt;

                var appUser = new AppUser{
                    FirstName = signUpDto.FirstName,
                    LastName = signUpDto.LastName,
                    UserName = uniqueUserName,
                    DateOfBirth = signUpDto.DateOfBirth,
                    Email = signUpDto.Email,
                    CreatedAt = createdAt,
                };

                var createdUser = await _userManager.CreateAsync(appUser, signUpDto.Password);
                if(!createdUser.Succeeded){
                    return StatusCode(500, createdUser.Errors);
                }

                var addedRole = await _userManager.AddToRoleAsync(appUser, "User");
                if(!addedRole.Succeeded){
                    return StatusCode(500, addedRole.Errors);
                }

                return Ok(new { Message = "User created successfully", UserId = appUser.Id, Token = _tokenService.CreateToken(appUser) });
            }
            catch (Exception e){
                return StatusCode(500, e);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto){
            if(!ModelState.IsValid){
                return BadRequest(FormatModelStateErrros());
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Email == loginDto.Email);
            if(user == null){
                return Unauthorized("Invalid Email or Incorrect Password");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(!result.Succeeded){
                return Unauthorized("Invalid Email or Incorrect Password");
            }

            return Ok(new { Message = "Login successfully", UserId = user.Id, Token = _tokenService.CreateToken(user)});
        }

        private object FormatModelStateErrros(){
            var errors = ModelState
            .Where(message => message.Value != null && message.Value.Errors.Any())
            .Select(message => new
                {
                    Field = message.Key,
                    Errors = message.Value?.Errors?.Select(e => e.ErrorMessage) ?? Enumerable.Empty<string>()
                })
            .ToList();

            Console.WriteLine(errors);

            return new {
                Message = "Validation failed",
                Errors = errors
            };
        }
    }
}
