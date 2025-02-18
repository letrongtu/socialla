import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Editor, EditorState, getDefaultKeyBinding, Modifier } from "draft-js";
import "../../../../../node_modules/draft-js/dist/Draft.css";

import { EmojiPopover } from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";

import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { UseCreateDmMessage } from "../api/use-create-dm-message";

interface MessageEditorProps {
  senderId: string;
  userIds: string[];
  conversationId: string | null;
  parentMessageId?: string;
}

const MessageEditor = ({
  senderId,
  userIds,
  conversationId,
  parentMessageId,
}: MessageEditorProps) => {
  const editorRef = useRef<Editor | null>(null);

  const { mutate: createDmMessage, isPending: isPendingCreateDmMessage } =
    UseCreateDmMessage();

  const [messageContent, setMessageContent] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const isMessageEmpty =
    messageContent.length === 0 ||
    messageContent.every((line) => line.trim() === "");

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);

    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    const lines = plainText.split("\n");

    setMessageContent(lines);
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

  const handleCreateMessage = () => {
    createDmMessage(
      {
        content: messageContent,
        senderId: senderId,
        userIds: userIds,
        conversationId: conversationId,
        parentMessageId: parentMessageId,
      },
      {
        onSuccess: () => {
          handleCreateSuccess();
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };
  const handleCreateSuccess = () => {
    setMessageContent([]);
    setEditorState(() => EditorState.createEmpty());
  };

  const handleKeyCommand = (command: string): "handled" | "not-handled" => {
    if (command === "create-message") {
      if (!isMessageEmpty && !isPendingCreateDmMessage) {
        handleCreateMessage();
      }

      return "handled";
    }

    if (command === "cancel" && isPendingCreateDmMessage) {
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.key === "Enter" && !e.shiftKey) {
      return "create-message";
    }

    if (e.ctrlKey && e.key === "Backspace") {
      return "cancel";
    }

    return getDefaultKeyBinding(e);
  };

  return (
    <div
      className={cn(
        "relative w-80 p-3 flex items-center justify-between gap-x-2"
      )}
    >
      <div className="relative w-64 px-1 flex items-center gap-x-2 rounded-xl bg-[#c9ccd1]/30">
        <div className="w-full max-h-36 rounded-xl flex flex-col justify-between overflow-auto custom-scrollbar">
          <div className="p-2 break-words text-sm">
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={handleChange}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={keyBindingFn}
              placeholder="Aa"
            />
          </div>
        </div>

        <div className="flex size-7 h-full items-end">
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <div className="absolute bottom-1 right-1 size-7 flex items-center justify-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer">
              <MdEmojiEmotions className="size-[1.1rem] text-[#1823ab]" />
            </div>
          </EmojiPopover>
        </div>
      </div>

      <div className="size-8">
        <Button
          disabled={isMessageEmpty || isPendingCreateDmMessage}
          onClick={handleCreateMessage}
          className="absolute bottom-3.5 right-[0.67rem] size-8 rounded-full bg-transparent hover:bg-[#c9ccd1]/50"
        >
          <IoSend
            className={cn(
              "text-[#1823ab]",
              isMessageEmpty && "text-muted-foreground"
            )}
          />
        </Button>
      </div>
    </div>
  );
};

export default MessageEditor;
