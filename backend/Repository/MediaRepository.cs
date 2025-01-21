using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Interfaces;
using backend.Models;

namespace backend.Repository
{
    public class MediaRepository : IMediaRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public MediaRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MediaFile> UploadDBAsync(MediaFile file)
        {
            await _dbContext.MediaFiles.AddAsync(file);
            await _dbContext.SaveChangesAsync();

            return file;
        }
    }
}
