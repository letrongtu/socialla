using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.MessageReaction;

namespace backend.Mappers.MessageReaction
{
    public static class MessageReactionMappers
    {
        public static backend.Models.MessageReaction ToMessageReactionFromCreate(this CreateMessageReactionDto messageReactionDto){
            return new backend.Models.MessageReaction {
                Reaction = messageReactionDto.Reaction,
                CreatedAt = DateTime.Now,
                UserId = messageReactionDto.UserId,
                MessageId = messageReactionDto.MessageId,
            };
        }
    }
}
