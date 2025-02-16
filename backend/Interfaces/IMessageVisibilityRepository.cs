using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MessageVisibility;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMessageVisibilityRepository
    {

        Task<MessageVisibility> CreateAsync(MessageVisibility messageVisibility);
        Task<MessageVisibility?> DeleteAsync(DeleteMessageVisibilityDto messageVisibilityDto);
    }
}
