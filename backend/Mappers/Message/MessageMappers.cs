using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Message;

namespace backend.Mappers.Message
{
    public static class MessageMappers
    {
        public static backend.Models.Message ToMessageFromCreate(this CreateMessageDto messageDto){
            return new Models.Message {
                Content = messageDto.Content,
                ConversationId = messageDto.ConversationId,
                SenderId = messageDto.SenderId,
                FileUrls = messageDto.FileUrls,
                CreatedAt = DateTime.Now
            };
        }
    }
}
