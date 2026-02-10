import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import codingProblemService from "../../services/codingProblemService";

interface Props {
  closeModal: () => void;
  refreshLinks: () => void;
  editData?: any;
  isEditMode?: boolean;
}

type TestCase = {
  input: string;
  output: string;
  visible: boolean;
};

function SectionBox({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

// Tiptap Rich Text Editor Component
const TiptapEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) => {
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
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 outline-none bg-white text-gray-800 prose prose-sm max-w-none focus:bg-white",
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  return (
    <div className="border-[1.5px] border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 flex-wrap items-center">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold (Ctrl+B)"
        >
          <strong className="text-sm">B</strong>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic (Ctrl+I)"
        >
          <em className="text-sm">I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive("underline") ? "bg-gray-200" : ""
          }`}
          title="Underline (Ctrl+U)"
        >
          <span className="underline text-sm">U</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Font Family */}
        <select
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
        </select>

        {/* Font Size */}
        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm cursor-pointer bg-white min-w-[70px] outline-none"
          defaultValue="16px"
        >
          <option value="12px">12pt</option>
          <option value="14px">14pt</option>
          <option value="16px">16pt</option>
          <option value="18px">18pt</option>
          <option value="20px">20pt</option>
          <option value="24px">24pt</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Align Left */}
        <button
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
        </button>

        {/* Align Center */}
        <button
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
        </button>

        {/* Align Right */}
        <button
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
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
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
          className={`px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Numbered List"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="10" y1="6" x2="21" y2="6" />
            <line x1="10" y1="12" x2="21" y2="12" />
            <line x1="10" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror {
          min-height: 300px;
          padding: 1rem;
          outline: none;
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

const AddNewProblem: React.FC<Props> = ({
  closeModal,
  refreshLinks,
  editData,
  isEditMode,
}) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");

  // Store as HTML
  const [problemDescription, setProblemDescription] = useState("");
  const [constraint, setConstraint] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");

  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", output: "", visible: false },
  ]);
  const [basicCodeLayout, setBasicCodeLayout] = useState("");

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", visible: false }]);
  };

  const updateTestCase = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...testCases];
    updated[index].visible = !updated[index].visible;
    setTestCases(updated);
  };

  const removeTestCase = (index: number) => {
    const updated = testCases.filter((_, i) => i !== index);
    setTestCases(updated);
  };

  useEffect(() => {
    if (isEditMode && editData) {
      setTitle(editData.title || "");
      setDifficulty(editData.difficulty?.toLowerCase() || "easy");
      setTopic(
        Array.isArray(editData.topic)
          ? editData.topic.join(", ")
          : editData.topic || ""
      );

      // Load HTML content directly
      setProblemDescription(editData.problem_description || "");
      setConstraint(editData.constraint || "");
      setInputFormat(editData.input_format || "");
      setOutputFormat(editData.output_format || "");

      setBasicCodeLayout(editData.basic_code_layout || "");

      // Load test cases if available; otherwise fallback to sample_input/sample_output
      const apiTestCases = Array.isArray(editData.testCases)
        ? editData.testCases
        : [];

      if (apiTestCases.length > 0) {
        const mapped = apiTestCases.map((tc: any) => ({
          input: tc.input || "",
          output: tc.expected_output || tc.output || "",
          visible: !tc.is_hidden,
        }));

        // If backend also stores sample_input/sample_output separately,
        // ensure the first test case is prefilled at least.
        if (mapped[0] && (!mapped[0].input || !mapped[0].output)) {
          mapped[0] = {
            ...mapped[0],
            input: mapped[0].input || editData.sample_input || "",
            output: mapped[0].output || editData.sample_output || "",
          };
        }

        setTestCases(mapped);
      } else {
        setTestCases([
          {
            input: editData.sample_input || "",
            output: editData.sample_output || "",
            visible: true,
          },
        ]);
      }
    }
  }, [editData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !difficulty) {
      alert("Please fill required fields.");
      return;
    }

    if (testCases.length === 0) {
      alert("Please add at least one test case.");
      return;
    }

    // Validate test cases
    const hasEmptyTestCase = testCases.some(
      (tc) => !tc.input.trim() || !tc.output.trim()
    );
    if (hasEmptyTestCase) {
      alert("Please fill in all test case inputs and outputs.");
      return;
    }

    setLoading(true);

    const topicArray = topic.includes(",")
      ? topic.split(",").map((t) => t.trim()).filter(Boolean)
      : [topic.trim()];
    const capitalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Send HTML content as-is to backend
    const problemData = {
      title: title.trim(),
      difficulty: capitalizedDifficulty,
      topic: topicArray,

      // Store formatted HTML content from Tiptap
      problem_description: problemDescription.trim(),
      constraint: constraint.trim(),
      input_format: inputFormat.trim(),
      output_format: outputFormat.trim(),
      basic_code_layout: basicCodeLayout.trim(),
      // Backend requires a non-empty string for problem_description_image
      // Use a simple placeholder URL by default
      problem_description_image:
        editData?.problem_description_image ||
        "https://via.placeholder.com/300x200?text=Problem+Image",
    };

    try {
      let res;

      if (isEditMode && editData?.id) {
        res = await codingProblemService.updateCodingProblem(
          editData.id,
          problemData
        );
      } else {
        res = await codingProblemService.createCodingProblemWithTestCases(
          problemData,
          testCases.map((tc) => ({
            input: tc.input.trim(),
            output: tc.output.trim(),
            visible: tc.visible,
          }))
        );
      }

      if (res?.success) {
        alert(
          isEditMode
            ? "Problem Updated Successfully!"
            : "Problem Created Successfully!"
        );
        refreshLinks();
        closeModal();
      } else {
        alert((res as any)?.message || "Validation error");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-auto p-8 rounded-3xl max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Update Coding Challenge" : "Create New Challenge"}
          </h2>
          <p className="text-gray-600 text-base">
            {isEditMode
              ? "Modify the coding challenge details below."
              : "Fill in the details to create a new coding challenge."}
          </p>
        </div>

        <SectionBox label="Problem Title">
          <input
            className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 outline-none transition-all focus:bg-white focus:border-gray-400"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </SectionBox>

        <div className="grid md:grid-cols-2 gap-6">
          <SectionBox label="Difficulty">
            <select
              className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 outline-none transition-all focus:bg-white focus:border-gray-400"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </SectionBox>

          <SectionBox label="Topic">
            <input
              className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 outline-none transition-all focus:bg-white focus:border-gray-400"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Arrays, Hash Map"
              required
            />
          </SectionBox>
        </div>

        <SectionBox label="Problem Description">
          <TiptapEditor
            value={problemDescription}
            onChange={setProblemDescription}
          />
        </SectionBox>

        <SectionBox label="Constraints">
          <TiptapEditor value={constraint} onChange={setConstraint} />
        </SectionBox>

        <SectionBox label="Input Format">
          <TiptapEditor value={inputFormat} onChange={setInputFormat} />
        </SectionBox>

        <SectionBox label="Output Format">
          <TiptapEditor value={outputFormat} onChange={setOutputFormat} />
        </SectionBox>

        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700 text-lg">Test Cases</h3>
          {testCases.map((tc, index) => (
            <div
              key={index}
              className={`border rounded-2xl p-4 shadow-sm transition ${
                tc.visible ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Test Case {index + 1}</h2>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {tc.visible ? "Visible" : "Hidden"}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleVisibility(index)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        tc.visible ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          tc.visible ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <SectionBox label="Input">
                  <textarea
                    className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-28 outline-none transition-all focus:bg-white focus:border-gray-400"
                    value={tc.input}
                    onChange={(e) =>
                      updateTestCase(index, "input", e.target.value)
                    }
                    placeholder="Enter test case input"
                    required
                  />
                </SectionBox>

                <SectionBox label="Expected Output">
                  <textarea
                    className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-28 outline-none transition-all focus:bg-white focus:border-gray-400"
                    value={tc.output}
                    onChange={(e) =>
                      updateTestCase(index, "output", e.target.value)
                    }
                    placeholder="Enter expected output"
                    required
                  />
                </SectionBox>
              </div>
            </div>
          ))}

          <div className="flex flex-row-reverse">
            <button
              type="button"
              onClick={addTestCase}
              className="px-5 py-2 rounded-xl bg-[#1DA077] text-white font-medium shadow hover:opacity-90 transition"
            >
              + Add Test Case
            </button>
          </div>
        </div>

        <SectionBox label="Code Template">
          <textarea
            className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-40 outline-none transition-all focus:bg-white focus:border-gray-400"
            value={basicCodeLayout}
            onChange={(e) => setBasicCodeLayout(e.target.value)}
            placeholder="Enter starter code template"
            required
          />
        </SectionBox>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1DA077] text-white px-6 py-3 border-none rounded-xl font-bold text-base cursor-pointer transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Problem"
              : "Create Problem"}
        </button>
      </form>
    </div>
  );
};

export default AddNewProblem;