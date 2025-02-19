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
                ConversationId = messageDto.ConversationId,
                SenderId = messageDto.SenderId,
                ParentMessageId = messageDto.ParentMessageId,
                Content = messageDto.Content,
                FileUrls = messageDto.FileUrls,
                IsEmojiOnly = messageDto.IsEmojiOnly,
                CreatedAt = DateTime.Now
            };
        }
    }
}
