using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Friendship;
using backend.Models;
using backend.Utils;

namespace backend.Interfaces
{
    public interface IFriendshipRepository
    {
        Task<Friendship> CreateAsync(Friendship friendship);
        Task<Friendship?> DeleteAsync(DeleteFriendshipDto friendDto);
        Task<Friendship?> UpdateAcceptAsync(UpdateAcceptFriendshipDto friendDto);
        Task<List<Friendship>> GetAllByUserIdAsync(string userId);
        Task<PagedResult<string>> GetPaginatedByUserIdAsync(string userId, int pageNumber, int pageSize);
        Task<int> GetMutualFriendCountAsync(string firstUserId, string secondUserId);
        Task<Friendship?> CheckFriendshipAsync(string firstUserId, string secondUserId);
    }
}
