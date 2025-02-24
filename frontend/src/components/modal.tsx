"use client";

import { useEffect, useState } from "react";
import { CreatePostModal } from "@/features/posts/components/create-post-modal";
import { PostCommentModal } from "@/features/post-comments/components/post-comment-modal";
import { MessageModal } from "@/features/messages/components/message-modal";

export default function Modal() {
  return (
    <>
      <CreatePostModal />
      <PostCommentModal />
      <MessageModal />
    </>
  );
}
