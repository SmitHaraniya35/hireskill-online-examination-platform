import { useEffect, useState, useSyncExternalStore } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import codingProblemService from "../../services/codingProblem.services";
import type { TestCaseData } from "../../types/codingProblem.types";

interface Props {
  closeModal: () => void;
  refreshLinks: () => void;
  editData?: any;
  isEditMode?: boolean;
}

function SectionBox({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

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
        {/* <select
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
        </select> */}

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

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [testCases, setTestCases] = useState<TestCaseData[]>([
    { input: "", expected_output: "", is_hidden: false   },
  ]);
  const [basicCodeLayout, setBasicCodeLayout] = useState("");

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", expected_output: "", is_hidden: true },
    ]);
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expected_output",
    value: string,
  ) => {
    const updated = [...testCases];
    console.log("updated data: ",updated);
    updated[index][field] = value;
    setTestCases(updated);
  };

  const toggleVisibility = (index: number) => {
    const updated = [...testCases];
    updated[index].is_hidden = !updated[index].is_hidden;
    setTestCases(updated);
  };
  // const toggleVisibility = (index: number) => {
  //   const updated = [...testCases];
  //   updated[index].is_hidden = !updated[index].is_hidden;
  //   setTestCases(updated);
  // };

  const removeTestCase = (index: number) => {
    const updated = testCases.filter((_, i) => i !== index);
    setTestCases(updated);
  };

  useEffect(() => {
    if (isEditMode && editData) {
      console.log("Loading edit data:", editData);

      setTitle(editData.title || "");
      setDifficulty(editData.difficulty?.toLowerCase() || "easy");

      if (Array.isArray(editData.topic)) {
        setTopic(editData.topic.join(", "));
      } else {
        setTopic(editData.topic || "");
      }

      setProblemDescription(editData.problem_description || "");
      setConstraint(editData.constraint || "");
      setInputFormat(editData.input_format || "");
      setOutputFormat(editData.output_format || "");
      setBasicCodeLayout(editData.basic_code_layout || "");

      const testCasesList = editData.testcases || [];

      

      if (testCasesList.length > 0) {
        setTestCases(
          testCasesList.map((tc: any) => ({
            id: tc.id,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: !tc.is_hidden,
          })),
        );
      }
    }
  }, [isEditMode, editData]);

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

    const hasEmptyTestCase = testCases.some(
      (tc) => !tc.input.trim() || !tc.expected_output.trim(),
    );
    if (hasEmptyTestCase) {
      alert("Please fill in all test case inputs and outputs.");
      return;
    }

    setLoading(true);

    const topicArray = topic.includes(",")
      ? topic
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : topic.trim()
        ? [topic.trim()]
        : [];

    const capitalizedDifficulty =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const problemData = {
      title: title.trim(),
      difficulty: capitalizedDifficulty,
      topic: topicArray,
      problem_description: problemDescription.trim(),
      problem_description_image:
        editData?.problem_description_image ||
        "https://via.placeholder.com/300x200?text=Problem+Image",
      constraint: constraint.trim(),
      input_format: inputFormat.trim(),
      output_format: outputFormat.trim(),
      basic_code_layout: basicCodeLayout.trim(),
    };

    try {
      let res;
      if (isEditMode && editData?.id) {
        const updatePayload = {
          ...problemData,
          testCases: testCases.map((tc) => ({
            ...(tc.id && { id: tc.id }),
            input: tc.input.trim(),
            expected_output: tc.expected_output.trim(),
            is_hidden: tc.is_hidden=== false,
          })),
        };
        try{
          res = await codingProblemService.updateCodingProblemWithTestCases(editData.id, updatePayload);
        }catch(err: any){
          console.log("error",err)
          setIsError(true);
          setErrorMsg(err.response.data.message);
        }
      } else {
        const createPayloadTestCases = testCases.map((tc) => ({
          input: tc.input.trim(),
          expected_output: tc.expected_output.trim(),
          is_hidden: tc.is_hidden,
        }));
        const createPayload = {
          ...problemData,
          testCases: createPayloadTestCases,
        }
        console.log("creating payload",createPayload);
        try{
          res = await codingProblemService.createCodingProblemWithTestCases(createPayload);
        }catch(err: any){
          console.log("hello");
          setIsError(true);
          console.log(err.response.data);
          setErrorMsg(err.response.data.message);
        }
        
      }

      if (res?.success) {
        alert(
          isEditMode
            ? "Problem Updated Successfully!"
            : "Problem Created Successfully!",
        );
        await refreshLinks();
        closeModal();
      } else {
        alert(res?.message || "Validation error");
      }
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-auto p-8 rounded-3xl">
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

        {/* Input and Output Formats side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionBox label="Input Format">
            <TiptapEditor value={inputFormat} onChange={setInputFormat} />
          </SectionBox>

          <SectionBox label="Output Format">
            <TiptapEditor value={outputFormat} onChange={setOutputFormat} />
          </SectionBox>
        </div>

        {/* Constraints after Input/Output */}
        <SectionBox label="Constraints">
          <TiptapEditor value={constraint} onChange={setConstraint} />
        </SectionBox>

        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700 text-lg">Test Cases</h3>
          {testCases.map((tc, index) => (
            <div
              key={tc.id ?? `tc-${index}`}
              className={`border rounded-2xl p-4 shadow-sm transition ${
                tc.is_hidden ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Test Case {index + 1}</h2>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">
                      {tc.is_hidden ? "Hidden" : "Visible"}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleVisibility(index)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        tc.is_hidden ?  "bg-gray-300": "bg-green-500"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          tc.is_hidden ? "translate-x-0": "translate-x-5" 
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
                    value={tc.expected_output}
                    onChange={(e) =>
                      updateTestCase(index, "expected_output", e.target.value)
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
