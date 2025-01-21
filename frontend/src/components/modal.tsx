"use client";

import { useEffect, useState } from "react";
import { CreatePostModal } from "@/features/posts/components/create-post-modal";

export default function Modal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreatePostModal />
    </>
  );
}
