import emojiData from "unicode-emoji-json";
import { FaHeart } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const reactionsData = [
  {
    reaction: "Like",
    defaultIcon: AiOutlineLike,
    fillIcon: AiFillLike,
  },
  { reaction: "Love", fillIcon: FaHeart },
  { reaction: "Haha", emojiSlug: "grinning_squinting_face" },
  { reaction: "Wow", emojiSlug: "face_with_open_mouth" },
  { reaction: "Sad", emojiSlug: "crying_face" },
  { reaction: "Angry", emojiSlug: "enraged_face" },
];

export const reactionsWithEmojiAndIcon = reactionsData.map(
  ({ reaction, emojiSlug, defaultIcon, fillIcon }) => {
    const emoji = Object.entries(emojiData).find(
      ([, data]) => data.slug === emojiSlug
    )?.[0];

    return {
      reaction,
      emoji: emoji || null,
      defaultIcon: defaultIcon || null,
      fillIcon: fillIcon || null,
    };
  }
);

//TODO: Put the reaction to the db
