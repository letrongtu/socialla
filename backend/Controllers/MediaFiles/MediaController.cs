using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.MediaFiles
{
    [Route("api/media")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IMediaRepository _mediaRepo;
        private readonly UserManager<AppUser> _userManager;
        public MediaController(IWebHostEnvironment environment, IMediaRepository mediaRepo, UserManager<AppUser> userManager)
        {
            _environment = environment;
            _mediaRepo = mediaRepo;
            _userManager = userManager;
        }

        // [HttpPost("upload")]
        // [Authorize]
        // public async Task<IActionResult> Upload(IFormFile file, string userId){
        //     if(file == null || file.Length == 0){
        //         return BadRequest("No file uploaded.");
        //     }

        //     if (string.IsNullOrWhiteSpace(userId))
        //     {
        //         return BadRequest("User ID cannot be null or empty.");
        //     }

        //     var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

        //     if (user == null)
        //     {
        //         return NotFound("User not found");
        //     }

        //     var fileType = Path.GetExtension(file.FileName).ToLower();
        //     var allowedFileTypes = new [] { ".jpg", ".png", ".jpeg", ".gif", ".mp4", ".mov" };

        //     if(!allowedFileTypes.Contains(fileType)){
        //         return BadRequest("Unsupported file type");
        //     }

        //     var uploadPath = GetFilePath(userId);

        //     if(!Directory.Exists(uploadPath)){
        //         Directory.CreateDirectory(uploadPath);
        //     }

        //     var filePath = Path.Combine(uploadPath, file.FileName);
        //     using (var stream = new FileStream(filePath, FileMode.Create)){
        //         await file.CopyToAsync(stream);
        //     }

        //     var hostUrl= $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        //     var publicUrl = hostUrl  + "/Uploads/Users/" + userId + "/" + file.FileName;

        //     return Ok(new {FileName = file.FileName, FileUrl = publicUrl});
        // }

        // [HttpPost("db-upload")]
        // [Authorize]
        // public async Task<IActionResult> DbUpload(IFormFile file, string userId){
        //     if(file == null || file.Length == 0){
        //         return BadRequest("No file uploaded.");
        //     }

        //     var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

        //     if (user == null)
        //     {
        //         return NotFound("User not found");
        //     }

        //     var fileType = Path.GetExtension(file.FileName).ToLower();
        //     var allowedFileTypes = new [] { ".jpg", ".png", ".jpeg", ".gif", ".mp4", ".mov" };

        //     if(!allowedFileTypes.Contains(fileType)){
        //         return BadRequest("Unsupported file type");
        //     }

        //     using var memoryStream = new MemoryStream();

        //     await file.CopyToAsync(memoryStream);

        //     var mediaFile = new MediaFile
        //     {
        //         FileName = file.FileName,
        //         Data = memoryStream.ToArray(),
        //         ContentType = file.ContentType
        //     };

        //     await _mediaRepo.UploadDBAsync(mediaFile);

        //     return Ok(new { FileId = mediaFile.Id });
        // }

        [HttpPost("local-multi-upload")]
        [Authorize]
        public async Task<IActionResult> MultiUpload([FromForm] List<IFormFile> files, [FromForm] string userId){
            if(files == null || files.Count == 0){
                return BadRequest("No files uploaded.");
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("User ID cannot be null or empty.");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var allowedFileTypes = new [] { ".jpg", ".png", ".jpeg", ".gif", ".mp4", ".mov" };

            var invalidTypeFiles = files
                .Where(file => file != null && file.Length > 0)
                .Where(file => !allowedFileTypes.Contains(
                            Path.GetExtension(file.FileName).ToLower()
                            )
                )
                .Select(file => file.FileName)
                .ToList();

            if(invalidTypeFiles.Count > 0){
                return BadRequest(new{Message="Unsupported file type", InvalidFiles = invalidTypeFiles});
            }

            var uploadResults = new List<string>();

            // LOCAL STORAGE:
            // foreach(var file in files){
            //     if(file.Length > 100 * 1024 * 1024){
            //         return BadRequest("The file size exceeds the maximum limit of 100MB");
            //     }

            //     var uploadPath = GetFilePath(userId);

            //     if(!Directory.Exists(uploadPath)){
            //         Directory.CreateDirectory(uploadPath);
            //     }

            //     var filePath = Path.Combine(uploadPath, file.FileName);

            //     if(!System.IO.File.Exists(filePath)){
            //         using (var stream = new FileStream(filePath, FileMode.Create)){
            //             await file.CopyToAsync(stream);
            //         }
            //     }

            //     var hostUrl= $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            //     var publicUrl = hostUrl  + "/Uploads/Users/" + userId + "/" + file.FileName;

            //     uploadResults.Add(publicUrl);
            // }

            // Get Azure Blob Storage connection string from environment variables
            var connectionString = Environment.GetEnvironmentVariable("AzureStorageConnectionString");
            if (string.IsNullOrEmpty(connectionString))
            {
                return StatusCode(500, "Azure Storage Connection String is missing.");
            }

            var blobServiceClient = new BlobServiceClient(connectionString);
            var containerClient = blobServiceClient.GetBlobContainerClient("uploads");

            // Ensure the container exists
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            foreach (var file in files)
            {
                if (file.Length > 100 * 1024 * 1024)
                {
                    return BadRequest("The file size exceeds the maximum limit of 100MB");
                }

                // Generate a unique file name
                var uniqueFileName = $"{userId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var blobClient = containerClient.GetBlobClient(uniqueFileName);

                // Upload file to Azure Blob Storage
                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
                }

                uploadResults.Add(blobClient.Uri.ToString());
            }

            return Ok(new {Message = "Files uploaded successfully!", UploadedFileUrls = uploadResults});
        }

        //TODO: Add PostID to all URL
        [HttpPost("db-multi-upload")]
        [Authorize]
        public async Task<IActionResult> DBMultiUpload(List<IFormFile> files, string userId){
            if(files == null || files.Count == 0){
                return BadRequest("No files uploaded.");
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("User ID cannot be null or empty.");
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Id == userId);

            if (user == null)
            {
                return NotFound("User who uploads the files, not found");
            }

            var allowedFileTypes = new [] { ".jpg", ".png", ".jpeg", ".gif", ".mp4", ".mov" };

            var invalidTypeFiles = files
                .Where(file => file != null && file.Length > 0)
                .Where(file => !allowedFileTypes.Contains(
                            Path.GetExtension(file.FileName).ToLower()
                            )
                )
                .Select(file => file.FileName)
                .ToList();

            if(invalidTypeFiles.Count > 0){
                return BadRequest(new{Message="Unsupported file type", InvalidFiles = invalidTypeFiles});
            }

            var uploadResults = new List<object>();

            foreach(var file in files){
                using var memoryStream = new MemoryStream();

                await file.CopyToAsync(memoryStream);

                var mediaFile = new MediaFile
                {
                    FileName = file.FileName,
                    Data = memoryStream.ToArray(),
                    ContentType = file.ContentType
                };

                await _mediaRepo.UploadDBAsync(mediaFile);

                uploadResults.Add(new { FileId = mediaFile.Id });
            }

            return Ok(new {Message = "Files uploaded successfully!", UploadedFileIds = uploadResults});
        }

        [NonAction]
        private string GetFilePath(string userId)
        {
            var webRootPath = _environment.WebRootPath;
            if (string.IsNullOrWhiteSpace(webRootPath))
            {
                webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }
            return Path.Combine(webRootPath, "Uploads", "Users", userId);
        }
    }
}
