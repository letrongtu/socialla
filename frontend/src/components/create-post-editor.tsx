import { useEffect, useRef, useState } from "react";
import { convertToRaw, Editor, EditorState, Modifier } from "draft-js";
import "../../node_modules/draft-js/dist/Draft.css";
import { useCreatePostModal } from "@/features/posts/store/use-create-post-modal";
import { EmojiPopover } from "./emoji-popover";
import { BsEmojiSmile } from "react-icons/bs";

interface CreatePostEditorProps {
  placeholder?: string;
}

const CreatePostEditor = ({ placeholder }: CreatePostEditorProps) => {
  const [open, _] = useCreatePostModal();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (open && editorRef.current) {
      editorRef.current.focus();
    }
  }, [open]);

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
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

  return (
    <>
      {/**TODO: Tag feature */}
      <div className="flex flex-col gap-y-6">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleChange}
          placeholder={placeholder}
        />

        <div className="w-full flex justify-end cursor-pointer">
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <BsEmojiSmile className="size-5 hover:text-[#5b5d60]/60" />
          </EmojiPopover>
        </div>
      </div>
    </>
  );
};

export default CreatePostEditor;
