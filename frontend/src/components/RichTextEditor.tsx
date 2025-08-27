import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

interface RichTextEditorProps {
  onChange: (content: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition-colors duration-200 ${
        isActive ? "bg-gray-200 text-gray-900" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {label}
    </button>
  );
};

const Toolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 p-2 border-b border-gray-300 bg-gray-50 w-full">
      <ToolbarButton
        label="H1"
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="H2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <ToolbarButton
        label="B"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="I"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="U"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Code"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <ToolbarButton
        label="• List"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1. List"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <ToolbarButton
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange,
  placeholder = "Start writing your story...",
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);
  const [, setSelectionKey] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        codeBlock: false,
      }),
      Underline,
      Code,
      HorizontalRule,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] max-h-[600px] overflow-y-auto p-4",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const text = editor.getText();
      const html = editor.getHTML();
      const trimmed = text.trim();
      const words = trimmed.length ? trimmed.split(/\s+/).length : 0;

      setWordCount(words);
      setCharCount(text.length);
      setIsEmpty(trimmed.length === 0);
      onChange(html);
    };

    const handleSelectionUpdate = () => setSelectionKey((k) => k + 1);

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleSelectionUpdate);
    handleUpdate();

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, onChange]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg bg-white shadow-sm min-h-[200px]" />
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <Toolbar editor={editor} />
      <div className="relative">
        {isEmpty && (
          <div className="pointer-events-none absolute top-4 left-4 text-gray-400">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-300 text-sm text-gray-600">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
};
