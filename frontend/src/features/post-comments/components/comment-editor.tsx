import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Editor, EditorState, getDefaultKeyBinding, Modifier } from "draft-js";
import "../../../../node_modules/draft-js/dist/Draft.css";

import { UseCreateComment } from "../api/use-create-comment";
import { CurrentUserButton } from "@/components/current-user-button";

import { EmojiPopover } from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";

import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

interface CommentEditorProps {
  postId: string;
  userId: string;
  parentCommentId?: string;
  isReply?: boolean;
  setIsReply?: (isReply: boolean) => void;
  setShowReply?: (showReply: boolean) => void;
  replyEditor?: boolean;
}

const CommentEditor = ({
  postId,
  userId,
  parentCommentId,
  isReply = false,
  setIsReply,
  setShowReply,
  replyEditor = false,
}: CommentEditorProps) => {
  const { mutate: createComment, isPending } = UseCreateComment();

  const editorRef = useRef<Editor | null>(null);

  const [commentContent, setCommentContent] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const isCommentEmpty =
    commentContent.length === 0 || commentContent.every((line) => line === "");

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);

    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const lines = plainText.split("\n");

    setCommentContent(lines);
  };

  const handleEmojiSelect = (emoji: any) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const nextContentState = Modifier.insertText(
      contentState,
      selection,
      emoji.native
    );

    const nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "insert-characters"
    );

    setEditorState(nextEditorState);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 1);
  };

  const handleCreateComment = () => {
    createComment(
      { content: commentContent, postId, userId, parentCommentId },
      {
        onSuccess: (data) => {
          handleCreateSuccess();
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };
  const handleCreateSuccess = () => {
    setCommentContent([]);
    setEditorState(() => EditorState.createEmpty());

    if (setIsReply) {
      setIsReply(false);
    }

    if (setShowReply) {
      setShowReply(true);
    }
  };

  const handleKeyCommand = (command: string): "handled" | "not-handled" => {
    if (command === "create-comment") {
      if (!isCommentEmpty && !isPending) {
        handleCreateComment();
      }

      return "handled";
    }

    if (command === "cancel" && setIsReply) {
      setIsReply(false);
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.key === "Enter" && !e.shiftKey) {
      return "create-comment";
    }

    if (e.ctrlKey && e.key === "Backspace") {
      return "cancel";
    }

    return getDefaultKeyBinding(e);
  };

  useEffect(() => {
    if (isReply && replyEditor) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
    }
  }, [isReply, replyEditor]);

  return (
    <div
      className={cn(
        "relative p-4 flex flex-col items-start justify-between gap-x-2",
        replyEditor && "pl-2 pr-0 p-0"
      )}
    >
      {!replyEditor && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-b from-gray-400/30 to-transparent/5" />
      )}

      <div className="w-full flex items-start justify-between gap-x-2">
        <CurrentUserButton />

        <div className="w-full max-h-96 rounded-xl flex flex-col justify-between bg-[#c9ccd1]/30 overflow-auto custom-scrollbar">
          <div className="p-2 break-words text-sm">
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={handleChange}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={keyBindingFn}
              placeholder="Write a comment"
            />
          </div>

          <div className="w-full h-10 flex items-center justify-between pb-3 px-2">
            <div className="size-8 flex items-center justify-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer">
              <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                <BsEmojiSmile className="size-[1.1rem] text-muted-foreground" />
              </EmojiPopover>
            </div>

            <Button
              disabled={isCommentEmpty || isPending}
              onClick={handleCreateComment}
              className="size-8 rounded-full bg-transparent hover:bg-[#c9ccd1]/50"
            >
              <IoSend
                className={cn(
                  "text-[#1823ab]",
                  isCommentEmpty && "text-muted-foreground"
                )}
              />
            </Button>
          </div>
        </div>
      </div>

      {replyEditor && (
        <div className="bottom-0 right-0 w-full flex items-center justify-end px-2">
          <p className="text-xs text-muted-foreground">
            Press Ctrl + Backspace to{" "}
            <span
              onClick={() => setIsReply && setIsReply(false)}
              className="font-semibold text-[#1823ab] hover:underline cursor-pointer"
            >
              Cancel
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentEditor;
