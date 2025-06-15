import React, { useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  FORMAT_TEXT_COMMAND,
  EditorState,
  $createParagraphNode,
  $createTextNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from "@lexical/list";
import { CodeNode, $createCodeNode } from "@lexical/code";

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const formatCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  };

  const insertBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
      <button
        onClick={formatBold}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
        type="button"
        title="Bold"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 4v12h4.5c2.5 0 4.5-1.5 4.5-4 0-1.5-.8-2.8-2-3.4.7-.6 1-1.6 1-2.6 0-2-1.5-3-4-3H6zm2 2h2c1 0 2 .5 2 1.5S11 9 10 9H8V6zm0 5h2.5c1.3 0 2.5.7 2.5 2s-1.2 2-2.5 2H8v-4z"/>
        </svg>
      </button>

      <button
        onClick={formatItalic}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
        type="button"
        title="Italic"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 4v2h1.5l-3 8H7v2h6v-2h-1.5l3-8H16V4h-6z"/>
        </svg>
      </button>

      <button
        onClick={formatUnderline}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
        type="button"
        title="Underline"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 3v7c0 2.2 1.8 4 4 4s4-1.8 4-4V3h-2v7c0 1.1-.9 2-2 2s-2-.9-2-2V3H6zm-2 14h12v1H4v-1z"/>
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={formatCode}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 font-mono text-sm"
        type="button"
        title="Code"
      >
        {"</>"}
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={insertBulletList}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
        type="button"
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm4-11h8v2H8V7zm0 6h8v2H8v-2zm0 6h8v2H8v-2z"/>
        </svg>
      </button>

      <button
        onClick={insertNumberedList}
        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
        type="button"
        title="Numbered List"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 5h1V2H3v1h1v2H3v1zm1 6H3v1h1v2H3v1h3v-1H5v-2h1V11zm-1 6h1v2H3v1h3v-4H3v1zm5-11h8v2H8V6zm0 6h8v2H8v-2zm0 6h8v2H8v-2z"/>
        </svg>
      </button>
    </div>
  );
}

// Word count plugin
function WordCountPlugin({ onWordCountChange }: { onWordCountChange: (count: number, chars: number) => void }) {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        onWordCountChange(words, chars);
      });
    });
  }, [editor, onWordCountChange]);

  return null;
}

interface RichTextEditorProps {
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange,
  placeholder = "Start writing your story...",
}) => {
  const [wordCount, setWordCount] = React.useState(0);
  const [charCount, setCharCount] = React.useState(0);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  }, []);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        onChange(textContent);
      });
    },
    [onChange]
  );

  const initialConfig = {
    namespace: "PenscapeEditor",
    theme: {
      paragraph: "mb-2 text-gray-800",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        code: "bg-gray-100 px-1 py-0.5 rounded font-mono text-sm",
      },
      list: {
        ul: "list-disc list-inside ml-4 mb-2",
        ol: "list-decimal list-inside ml-4 mb-2",
        listitem: "mb-1",
      },
    },
    onError: (_error: Error) => {},
    nodes: [ListNode, ListItemNode, CodeNode],
  };

  // Simple error boundary component
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 focus:outline-none prose prose-sm max-w-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={ErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <WordCountPlugin onWordCountChange={handleWordCountChange} />
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-300 text-sm text-gray-600">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </LexicalComposer>
    </div>
  );
};

