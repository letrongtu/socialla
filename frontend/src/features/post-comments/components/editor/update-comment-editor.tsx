import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  getDefaultKeyBinding,
  Modifier,
} from "draft-js";
import "../../../../../node_modules/draft-js/dist/Draft.css";

import { UseUpdateComment } from "../../api/use-update-comment";

import { EmojiPopover } from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";

import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

interface CommentEditorProps {
  commentId: string;
  defaultContent: string[];
  isEditComment: boolean;
  setIsEditComment: (isEdit: boolean) => void;
  setIsLastChildEditingFromParent?: (isLastChildEditing: boolean) => void;
  isLastChild: boolean;
}

const UpdateCommentEditor = ({
  commentId,
  defaultContent,
  isEditComment,
  setIsEditComment,
  setIsLastChildEditingFromParent,
  isLastChild,
}: CommentEditorProps) => {
  const { mutate: updateComment, isPending } = UseUpdateComment();

  const editorRef = useRef<Editor | null>(null);

  const [commentContent, setCommentContent] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.moveFocusToEnd(
      EditorState.createWithContent(
        ContentState.createFromText(defaultContent.join("\n"))
      )
    )
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

  const handleUpdateComment = () => {
    updateComment(
      { id: commentId, content: commentContent },
      {
        onSuccess: (data) => {
          handleCreateSuccess();
          console.log(data);
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
    setIsEditComment(false);

    if (setIsLastChildEditingFromParent && isLastChild) {
      setIsLastChildEditingFromParent(false);
    }
  };

  const handleKeyCommand = (command: string): "handled" | "not-handled" => {
    if (command === "create-comment") {
      if (!isCommentEmpty && !isPending) {
        handleUpdateComment();
      }

      return "handled";
    }

    if (command === "cancel") {
      setIsEditComment(false);

      if (setIsLastChildEditingFromParent && isLastChild) {
        setIsLastChildEditingFromParent(false);
      }

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
    if (isEditComment) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
    }
  }, [isEditComment]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-start justify-between gap-x-2"
      )}
    >
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
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <div className="size-8 flex items-center justify-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer">
              <BsEmojiSmile className="size-[1.1rem] text-muted-foreground" />
            </div>
          </EmojiPopover>

          <Button
            disabled={isCommentEmpty || isPending}
            onClick={handleUpdateComment}
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

      <div className="w-full flex items-center justify-end px-2">
        <p className="text-xs text-muted-foreground">
          Press Ctrl + Backspace to{" "}
          <span
            onClick={() => {
              setIsEditComment(false);

              if (setIsLastChildEditingFromParent && isLastChild) {
                setIsLastChildEditingFromParent(false);
              }
            }}
            className="font-semibold text-[#1823ab] hover:underline cursor-pointer"
          >
            Cancel
          </span>
        </p>
      </div>
    </div>
  );
};

export default UpdateCommentEditor;
