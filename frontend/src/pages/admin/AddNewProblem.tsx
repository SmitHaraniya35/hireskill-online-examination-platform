import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import codingProblemService from "../../services/codingProblemService";



const AddNewProblem: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [topic, setTopic] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [constraint, setConstraint] = useState("");
    const [inputFormate, setInputFormate] = useState("");
    const [outputFormate, setOutputFormate] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [sampleOutput, setSampleOutput] = useState("");
    const [basicCodeLayout, setBasicCodeLayout] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !difficulty || difficulty === "category") {
        alert("Please fill required fields.");
        return;
    }

    setLoading(true);

    // Construct the payload to match your backend error log exactly
    // Inside AddNewProblem.tsx -> handleSubmit

const problemData = {
    title: title.trim(),
    difficulty: difficulty.toLowerCase(),
    topic: [topic.trim()], 
    problem_description: problemDescription,
    // Provide a placeholder URL to satisfy the "not empty" requirement
    problem_description_image: "https://via.placeholder.com/150", 
    constraint: constraint,
    basic_code_layout: basicCodeLayout,
    input_format: inputFormate,
    output_format: outputFormate,
    sample_input: sampleInput,
    sample_output: sampleOutput,
};

    console.log("Sending Payload:", problemData);

    const result = await codingProblemService.createCodingProblem(problemData);

    if (result.success) {
        alert("Problem Created Successfully!");
        navigate("/admin/all-problems");
    } else {
        // This will now show you if any specific field still fails
        // console.error("Validation Errors:", result.errors);
        alert("Error: " + result.message);
    }
    setLoading(false);
};

    return (
        <>
            <Navbar />
            <h1 className="text-3xl font-bold p-[2.5rem] mb-5 flex justify-center text-[#111827]">Add Coding Problem</h1>
            <div className="flex flex-col bg-[#E8F6F1] justify-center items-center max-w-[700px] p-[2.5rem] rounded-[24px] mx-auto mb-10 shadow-sm">
                <form className="w-full flex flex-col justify-center items-start gap-[25px]" onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="w-full flex flex-col gap-[8px]">
                        <label className="font-bold text-gray-700 text-sm">Title</label>
                        <input
                            className="border-2 bg-[#F9FAFB] border-gray-200 h-[50px] w-full rounded-[12px] p-[12px] focus:outline-none focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 transition-all"
                            type="text"
                            placeholder="e.g. Find Maximum Element"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Difficulty */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm">Difficulty</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)} 
                                className="border-2 bg-[#F9FAFB] border-gray-200 h-[50px] w-full rounded-[12px] p-[12px] focus:outline-none focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10"
                                required
                            >
                                <option value="category">Select Level</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        {/* Topic */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm">Topic</label>
                            <input
                                className="border-2 bg-[#F9FAFB] border-gray-200 h-[50px] w-full rounded-[12px] p-[12px] focus:outline-none focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10"
                                type="text"
                                placeholder="e.g. Arrays, Strings"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Problem Description */}
                    <div className="w-full flex flex-col gap-[8px]">
                        <label className="font-bold text-gray-700 text-sm">Problem Description</label>
                        <textarea
                            className="border-2 border-gray-200 bg-[#F9FAFB] w-full rounded-[12px] p-[12px] min-h-[120px] focus:outline-none focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10"
                            placeholder="Write the full problem statement..."
                            value={problemDescription}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Constraints */}
                    <div className="w-full flex flex-col gap-[8px]">
                        <label className="font-bold text-gray-700 text-sm">Constraints</label>
                        <textarea
                            className="border-2 border-gray-200 bg-[#F9FAFB] w-full rounded-[12px] p-[12px] min-h-[80px] focus:outline-none focus:border-[#1DA077]"
                            placeholder="e.g. 1 <= N <= 10^5"
                            value={constraint}
                            onChange={(e) => setConstraint(e.target.value)}
                            required
                        />
                    </div>

                    {/* Formats Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm">Input Format</label>
                            <textarea
                                className="border-2 border-gray-200 bg-[#F9FAFB] w-full rounded-[12px] p-[12px] min-h-[80px] focus:outline-none focus:border-[#1DA077]"
                                value={inputFormate}
                                onChange={(e) => setInputFormate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm">Output Format</label>
                            <textarea
                                className="border-2 border-gray-200 bg-[#F9FAFB] w-full rounded-[12px] p-[12px] min-h-[80px] focus:outline-none focus:border-[#1DA077]"
                                value={outputFormate}
                                onChange={(e) => setOutputFormate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Samples Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm text-[#1DA077]">Sample Input</label>
                            <textarea
                                className="border-2 border-gray-200 bg-[#1DA077]/5 w-full rounded-[12px] p-[12px] min-h-[100px] font-mono text-xs focus:outline-none focus:border-[#1DA077]"
                                value={sampleInput}
                                onChange={(e) => setSampleInput(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-bold text-gray-700 text-sm text-[#1DA077]">Sample Output</label>
                            <textarea
                                className="border-2 border-gray-200 bg-[#1DA077]/5 w-full rounded-[12px] p-[12px] min-h-[100px] font-mono text-xs focus:outline-none focus:border-[#1DA077]"
                                value={sampleOutput}
                                onChange={(e) => setSampleOutput(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Basic Code Layout */}
                    <div className="w-full flex flex-col gap-[8px]">
                        <label className="font-bold text-gray-700 text-sm">Initial Code Layout (Boilerplate)</label>
                        <textarea
                            className="border-2 border-gray-200 w-full bg-[#111827] text-[#10B981] font-mono rounded-[12px] p-[12px] min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#1DA077]"
                            placeholder="function main() { ... }"
                            value={basicCodeLayout}
                            onChange={(e) => setBasicCodeLayout(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        onClick={() => navigate('/admin/coding-problem/')}
                        className="w-[100%] h-[55px] bg-[#1DA077] text-white font-bold py-3 rounded-[14px] hover:bg-[#158b62] active:scale-[0.98] transition-all mt-5 shadow-lg shadow-[#1DA077]/20 disabled:opacity-50"
                    >
                        {loading ? "Adding Problem..." : "Publish Problem"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddNewProblem;