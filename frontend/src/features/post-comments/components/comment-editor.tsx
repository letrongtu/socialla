import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Editor, EditorState, Modifier } from "draft-js";
import "../../../../node_modules/draft-js/dist/Draft.css";

import { EmojiPopover } from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";
import { CurrentUserButton } from "@/components/current-user-button";

import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

const CommentEditor = () => {
  const editorRef = useRef<Editor | null>(null);

  const [commentContent, setCommentContent] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const isCommentEmpty =
    commentContent.length === 0 ||
    (commentContent.length === 1 && commentContent[0] === "");

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

  const handleSendComment = () => {};

  return (
    <div className="relative p-4 flex items-start gap-x-2">
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-b from-gray-400/30 to-transparent/5" />

      <CurrentUserButton />

      <div className="w-full max-w-[38rem] max-h-96 rounded-lg flex flex-col justify-between bg-[#c9ccd1]/30 overflow-auto custom-scrollbar">
        <div className="p-2">
          <Editor
            editorState={editorState}
            onChange={handleChange}
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
            disabled={isCommentEmpty}
            onClick={handleSendComment}
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
  );
};

export default CommentEditor;
