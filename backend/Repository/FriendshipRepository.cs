using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Friendship;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly INotificationRepository _notificationRepo;
        private readonly IHubContext<FriendshipHub> _friendshipHubContext;
        public FriendshipRepository(ApplicationDBContext dbContext, INotificationRepository notificationRepo, IHubContext<FriendshipHub> friendshipHubContext)
        {
            _dbContext = dbContext;
            _notificationRepo = notificationRepo;
            _friendshipHubContext = friendshipHubContext;
        }

        public async Task<Friendship> CreateAsync(Friendship friendship)
        {
            await _dbContext.Friendships.AddAsync(friendship);
            await _dbContext.SaveChangesAsync();

            await _friendshipHubContext.Clients.All.SendAsync("ReceiveFriendshipCreate", friendship.FirstUserId, friendship.SecondUserId);


            var notifcation = new Notification{
                ReceiveUserId = friendship.SecondUserId,
                EntityType = NotificationEntityType.User,
                EntityId = friendship.FirstUserId,
                Type = NotificationType.Friend_Request,
                Content = "sent you a friend request",
            };

            await _notificationRepo.CreateAsync(notifcation);

            return friendship;
        }

        public async Task<Friendship?> DeleteAsync(DeleteFriendshipDto friendshipDto)
        {
            var existingFriendship = await CheckFriendshipAsync(friendshipDto.FirstUserId, friendshipDto.SecondUserId);

            if(existingFriendship == null){
                return null;
            }

            _dbContext.Friendships.Remove(existingFriendship);
            await _dbContext.SaveChangesAsync();

            await _friendshipHubContext.Clients.All.SendAsync("ReceiveFriendshipDelete", existingFriendship.FirstUserId, existingFriendship.SecondUserId);

            return existingFriendship;
        }

        public async Task<Friendship?> UpdateAcceptAsync(UpdateAcceptFriendshipDto friendDto)
        {
            var existingFriendship = await CheckFriendshipAsync(friendDto.FirstUserId, friendDto.SecondUserId);

            if(existingFriendship == null){
                return null;
            }

            existingFriendship.Status = FriendshipStatus.Accepted;
            existingFriendship.AcceptedAt = DateTime.Now;
            await _dbContext.SaveChangesAsync();

            await _friendshipHubContext.Clients.All.SendAsync("ReceiveFriendshipUpdate", existingFriendship.FirstUserId, existingFriendship.SecondUserId);

            //IMPORTANT: The user who accepts the friend request must be the firstUser
            var notifcation = new Notification{
                ReceiveUserId = existingFriendship.SecondUserId,
                EntityType = NotificationEntityType.User,
                EntityId = existingFriendship.FirstUserId,
                Type = NotificationType.Friend_Accept,
                Content = "accepted your friend request",
            };

            await _notificationRepo.CreateAsync(notifcation);

            return existingFriendship;
        }

        public async Task<List<Friendship>> GetAllByUserIdAsync(string userId)
        {
            return await _dbContext.Friendships.Where((friendship) => friendship.FirstUserId == userId || friendship.SecondUserId == userId).ToListAsync();
        }

        public async Task<Friendship?> CheckFriendshipAsync(string firstUserId, string secondUserId)
        {
            return await _dbContext.Friendships.FirstOrDefaultAsync((f) =>
                                                (f.FirstUserId == firstUserId && f.SecondUserId == secondUserId) ||
                                                (f.SecondUserId == firstUserId && f.FirstUserId == secondUserId));
        }


    }
}
