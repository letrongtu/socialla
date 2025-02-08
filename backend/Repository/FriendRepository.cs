using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using backend.Dtos.Friendship;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public FriendshipRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Friendship> CreateAsync(Friendship friendship)
        {
            await _dbContext.Friendships.AddAsync(friendship);
            await _dbContext.SaveChangesAsync();

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
