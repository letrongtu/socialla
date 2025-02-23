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
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentReaction> CommentReactions { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageVisibility> MessageVisibilities { get; set; }
        public DbSet<MessageReaction> MessageReactions { get; set; }
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

            //Friends Table
            builder.Entity<Friendship>().HasKey(f => new {f.FirstUserId, f.SecondUserId});

            //Conversation Members Table
            builder.Entity<ConversationMember>().HasKey(cm => new {cm.ConversationId, cm.UserId});

            //Message Visibilities Table
            builder.Entity<MessageVisibility>().HasKey(mv => new {mv.MessageId, mv.UserId});

            //MEssage Reactions Table
            builder.Entity<MessageReaction>().HasKey(mr => new {mr.UserId, mr.MessageId});
        }
    }
}
