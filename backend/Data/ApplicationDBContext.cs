using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
        {
        }

        public DbSet<MediaFile> MediaFiles { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostReaction> PostReactions { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);

            List<IdentityRole> roles = [
                new() {
                    Id = "Admin",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                },
                new(){
                    Id = "User",
                    Name = "User",
                    NormalizedName = "USER",
                },
            ];
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
