import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  height?: string;
  width?: string;
}

const TiptapEditor = ({
  value,
  onChange,
  height,
  width,
}: TiptapEditorProps) => {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      forceUpdate((n) => n + 1); // re-render on cursor move
    },
    onTransaction: () => {
      forceUpdate((n) => n + 1); // re-render on every transaction (bold toggle, etc.)
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 outline-none bg-white text-gray-800 prose prose-sm max-w-none focus:bg-white",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  // const setFontFamily = (font: string) => {
  //   editor.chain().focus().setFontFamily(font).run();
  // };

  return (
    // <div className="border-[1.5px] border-gray-200 rounded-xl overflow-hidden bg-white">
    <div
      className="border-[1.5px] border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col"
      style={{ height, width }}
    >
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 flex-wrap items-center flex-shrink-0">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded-lg transition min-w-[32px] h-[32px] flex items-center justify-center border ${
            editor.isActive("bold")
              ? "bg-gray-200 border-gray-400"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          title="Bold (Ctrl+B)"
        >
          <strong className="text-sm">B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded-lg transition min-w-[32px] h-[32px] flex items-center justify-center border ${
            editor.isActive("italic")
              ? "bg-gray-200 border-gray-400"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          title="Italic (Ctrl+I)"
        >
          <em className="text-sm">I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded-lg transition min-w-[32px] h-[32px] flex items-center justify-center border ${
            editor.isActive("underline")
              ? "bg-gray-200 border-gray-400"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          title="Underline (Ctrl+U)"
        >
          <span className="underline text-sm">U</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Font Family */}
        {/* <select
          onChange={(e) => setFontFamily(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm cursor-pointer bg-white min-w-[140px] outline-none"
          defaultValue="system-ui"
        >
          <option value="system-ui">System Font</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select> */}

        {/* <div className="w-px h-6 bg-gray-300 mx-1"></div> */}

        {/* Align Left */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
          title="Align Left"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button> */}

        {/* Align Center */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
          title="Align Center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button> */}

        {/* Align Right */}
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
          title="Align Right"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </button> */}

        {/* <div className="w-px h-6 bg-gray-300 mx-1"></div> */}

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded-lg transition min-w-[32px] h-[32px] flex items-center justify-center border ${
            editor.isActive("bulletList")
              ? "bg-gray-200 border-gray-400"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          title="Bullet List"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded-lg transition min-w-[32px] h-[32px] flex items-center justify-center border ${
            editor.isActive("orderedList")
              ? "bg-gray-200 border-gray-400"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          title="Numbered List"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="4.5" y1="3.5" x2="4.5" y2="7.5" strokeLinecap="round" />
            <line x1="3" y1="4.5" x2="4.5" y2="3.5" strokeLinecap="round" />

            <path
              d="M3 10.5 C3 9.5 3.5 9 4.5 9 C5.5 9 6 9.5 6 10.2 C6 11 3 13 3 13 H6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M3.2 16.5 C3.2 16 3.7 15.5 4.5 15.5 C5.3 15.5 5.8 16 5.8 16.6 C5.8 17.2 5.3 17.5 4.5 17.5 C5.3 17.5 5.8 18 5.8 18.6 C5.8 19.2 5.3 19.5 4.5 19.5 C3.7 19.5 3.2 19 3.2 18.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Lines */}
            <line x1="8.5" y1="5.5" x2="21" y2="5.5" strokeLinecap="round" />
            <line x1="8.5" y1="11" x2="21" y2="11" strokeLinecap="round" />
            <line x1="8.5" y1="17" x2="21" y2="17" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <div
        className="overflow-y-auto"
        style={{ height: `calc(${height} - 52px)` }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          outline: none;
          overflow-y: visible;  /* parent handles scroll */
          box-sizing: border-box;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 40px;
          margin: 1em 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 40px;
          margin: 1em 0;
        }
        .ProseMirror li {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
