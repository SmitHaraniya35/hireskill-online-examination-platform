import { useEffect, useState, useRef } from "react";
import codingProblemService from "../../services/codingProblemService";

interface Props {
    closeModal: () => void;
    refreshLinks: () => void;
    editData?: any;
    isEditMode?: boolean;
}

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (html: string) => void }) => {
    const [fontSize, setFontSize] = useState("16px");
    const [fontFamily, setFontFamily] = useState("system-ui");
    const editorRef = useRef<HTMLDivElement>(null);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value || undefined);
        editorRef.current?.focus();
    };

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const font = e.target.value;
        setFontFamily(font);
        execCommand('fontName', font);
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const size = e.target.value;
        setFontSize(size);
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            try {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.fontSize = size;
                
                const fragment = range.extractContents();
                span.appendChild(fragment);
                range.insertNode(span);
                
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                selection.addRange(newRange);
            } catch (error) {
                console.error('Font size change error:', error);
            }
        }
        
        if (editorRef.current) {
            editorRef.current.style.fontSize = size;
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    useEffect(() => {
        if (editorRef.current && value) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    return (
        <div className="border-[1.5px] border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 flex-wrap items-center">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    title="Bold (Ctrl+B)"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <strong className="text-sm">B</strong>
                </button>

                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    title="Italic (Ctrl+I)"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <em className="text-sm">I</em>
                </button>

                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    title="Underline (Ctrl+U)"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <span className="underline text-sm">U</span>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <select
                    value={fontFamily}
                    onChange={handleFontChange}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm cursor-pointer bg-white min-w-[140px] outline-none"
                >
                    <option value="system-ui">System Font</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Courier New', monospace">Courier New</option>
                </select>

                <select
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm cursor-pointer bg-white min-w-[70px] outline-none"
                >
                    <option value="12px">12pt</option>
                    <option value="14px">14pt</option>
                    <option value="16px">16pt</option>
                    <option value="18px">18pt</option>
                    <option value="20px">20pt</option>
                    <option value="24px">24pt</option>
                </select>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => execCommand('justifyLeft')}
                    title="Align Left"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="15" y2="12" />
                        <line x1="3" y1="18" x2="18" y2="18" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => execCommand('justifyCenter')}
                    title="Align Center"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => execCommand('justifyRight')}
                    title="Align Right"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="9" y1="12" x2="21" y2="12" />
                        <line x1="6" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Bullet List"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Numbered List"
                    className="px-2 py-1 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition min-w-[32px] h-[32px] flex items-center justify-center"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="10" y1="6" x2="21" y2="6" />
                        <line x1="10" y1="12" x2="21" y2="12" />
                        <line x1="10" y1="18" x2="21" y2="18" />
                        <text x="3" y="8" fontSize="8" fill="currentColor" stroke="none">1.</text>
                        <text x="3" y="14" fontSize="8" fill="currentColor" stroke="none">2.</text>
                        <text x="3" y="20" fontSize="8" fill="currentColor" stroke="none">3.</text>
                    </svg>
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[300px] p-4 outline-none bg-white text-gray-800 focus:bg-white"
                style={{
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    lineHeight: '1.6'
                }}
                suppressContentEditableWarning
            />

            <style>{`
                [contenteditable] ul {
                    list-style-type: disc;
                    padding-left: 40px;
                    margin: 1em 0;
                }
                [contenteditable] ol {
                    list-style-type: decimal;
                    padding-left: 40px;
                    margin: 1em 0;
                }
                [contenteditable] li {
                    margin: 0.5em 0;
                }
            `}</style>
        </div>
    );
};

// SectionBox Component
const SectionBox = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        {children}
    </div>
);

const AddNewProblem: React.FC<Props> = ({ closeModal, refreshLinks, editData, isEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [topic, setTopic] = useState("");
    const [fullProblemDescription, setFullProblemDescription] = useState("");
    const [constraint, setConstraint] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [sampleOutput, setSampleOutput] = useState("");
    const [basicCodeLayout, setBasicCodeLayout] = useState("");

    useEffect(() => {
        if (isEditMode && editData) {
            setTitle(editData.title || "");
            setDifficulty(editData.difficulty?.toLowerCase() || "easy");
            setTopic(Array.isArray(editData.topic) ? editData.topic.join(', ') : editData.topic || "");
            
            const combinedDescription = `
                ${editData.problem_description || ""}
                ${editData.input_format ? `<h3>Input Format</h3>${editData.input_format}` : ""}
                ${editData.output_format ? `<h3>Output Format</h3>${editData.output_format}` : ""}
            `;
            setFullProblemDescription(combinedDescription);
            
            setConstraint(editData.constraint || "");
            setSampleInput(editData.sample_input || "");
            setSampleOutput(editData.sample_output || "");
            setBasicCodeLayout(editData.basic_code_layout || "");
        }
    }, [editData, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !difficulty) {
            alert("Please fill required fields.");
            return;
        }

        setLoading(true);

        const problemData = {
            title: title.trim(),
            difficulty: difficulty.toLowerCase(),
            topic: topic.includes(',')
                ? topic.split(',').map(t => t.trim()).filter(t => t !== "")
                : [topic.trim()],
            problem_description: fullProblemDescription,
            problem_description_image: editData?.problem_description_image || "https://via.placeholder.com/150",
            constraint: constraint,
            basic_code_layout: basicCodeLayout,
            input_format: "",
            output_format: "",
            sample_input: sampleInput,
            sample_output: sampleOutput,
        };

        try {
            let res;
            const editId = editData?.id;

            if (isEditMode && editId) {
                res = await codingProblemService.updateCodingProblem(editId, problemData);
            } else {
                res = await codingProblemService.createCodingProblem(problemData);
            }

            if (res?.success) {
                alert(isEditMode ? "Problem Updated Successfully!" : "Problem Created Successfully!");
                refreshLinks();
                closeModal();
            } else {
                alert(`Validation Error: ${res?.message || "Please check all fields"}`);
            }
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Server Error: Unable to reach the API.");
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
                        {isEditMode ? "Modify the coding challenge details below." : "Fill in the details to create a new coding challenge."}
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
                            required
                        />
                    </SectionBox>
                </div>

                <SectionBox label="Problem Description (includes Input & Output Format)">
                    <RichTextEditor 
                        value={fullProblemDescription}
                        onChange={setFullProblemDescription}
                    />
                </SectionBox>

                <div className="grid md:grid-cols-2 gap-6">
                    <SectionBox label="Sample Input">
                        <textarea
                            className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-28 outline-none transition-all focus:bg-white focus:border-gray-400"
                            value={sampleInput}
                            onChange={(e) => setSampleInput(e.target.value)}
                            required
                        />
                    </SectionBox>

                    <SectionBox label="Sample Output">
                        <textarea
                            className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-28 outline-none transition-all focus:bg-white focus:border-gray-400"
                            value={sampleOutput}
                            onChange={(e) => setSampleOutput(e.target.value)}
                            required
                        />
                    </SectionBox>
                </div>

                <SectionBox label="Code Template">
                    <textarea
                        className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-base bg-gray-50 font-mono resize-none h-40 outline-none transition-all focus:bg-white focus:border-gray-400"
                        value={basicCodeLayout}
                        onChange={(e) => setBasicCodeLayout(e.target.value)}
                        required
                    />
                </SectionBox>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1DA077] text-white px-6 py-3 border-none rounded-xl font-bold text-base cursor-pointer transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : isEditMode ? "Update Problem" : "Create Problem"}
                </button>
            </form>
        </div>
    );
};

export default AddNewProblem;