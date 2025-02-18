"use client";

import { useEffect, useState } from "react";
import { CreatePostModal } from "@/features/posts/components/create-post-modal";
import { PostCommentModal } from "@/features/post-comments/components/post-comment-modal";
import { MessageModal } from "@/features/messages/components/message-modal";

export default function Modal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreatePostModal />
      <PostCommentModal />
      <MessageModal />
    </>
  );
}
