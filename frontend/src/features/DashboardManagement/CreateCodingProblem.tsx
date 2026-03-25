import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TiptapEditor from "../../components/TipTapEditor";
import codingProblemService from "../../services/codingProblem.services";
import codingProblemTemplateService from "../../services/codingProblemTemplate.services";
import testCaseService from "../../services/testCase.services";
import { toast } from "react-toastify";
import { Editor } from "@monaco-editor/react";
import type { CodingProblemData, TemplateCodes } from "../../types/codingProblem.types";
import { problemSchema, type ProblemFormInput } from "../../validators/createCodingProblem.validators";

// ─── Static Topics List ───────────────────────────────────────────────────────
const ALL_TOPICS = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math",
  "Sorting", "Greedy", "Depth-First Search", "Binary Search", "Breadth-First Search",
  "Tree", "Matrix", "Two Pointers", "Bit Manipulation", "Stack",
  "Heap (Priority Queue)", "Graph", "Prefix Sum", "Sliding Window", "Union Find",
  "Linked List", "Ordered Set", "Monotonic Stack", "Recursion", "Trie",
  "Binary Tree", "Divide and Conquer", "Queue", "Memoization", "Backtracking",
  "Segment Tree", "Binary Search Tree", "Simulation", "Topological Sort",
];

// ─── Topic Dropdown Input ─────────────────────────────────────────────────────
const TopicTagInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  error?: string;
}> = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = value
    ? value.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const filtered = ALL_TOPICS.filter(
    (t) => t.toLowerCase().includes(search.toLowerCase()) && !selected.includes(t)
  );

  const toggleTopic = (topic: string) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((t) => t !== topic).join(", "));
    } else {
      onChange([...selected, topic].join(", "));
    }
  };

  const removeTopic = (topic: string) => {
    onChange(selected.filter((t) => t !== topic).join(", "));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        className={`flex flex-wrap items-center gap-1.5 min-h-[42px] px-3 py-2 border rounded-lg bg-white cursor-pointer ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0 && (
          <span className="text-sm text-gray-400 select-none">Select topics...</span>
        )}
        {selected.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTopic(tag); }}
              className="text-gray-400 hover:text-gray-700 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <svg
          className={`w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search topics..."
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
            />
          </div>
          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">No topics found</p>
            ) : (
              filtered.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleTopic(topic); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {topic}
                </button>
              ))
            )}
          </div>
          {/* Footer */}
          {selected.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{selected.length} selected</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────
const CreateCodingProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = searchParams.get("mode") === "edit";

  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [deletingTemplates, setDeletingTemplates] = useState<Record<string, boolean>>({});
  const [deletingTestCases, setDeletingTestCases] = useState<Record<number, boolean>>({});

  // ── Language Templates state ───────────────────────────────────────────────
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [activeLang, setActiveLang] = useState<string>("");
  const [openLangs, setOpenLangs] = useState<string[]>([]);
  const [templateCodes, setTemplateCodes] = useState<TemplateCodes[]>([]);
  const [templateErrors, setTemplateErrors] = useState<Record<string, string>>({});
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // ── Image previews ─────────────────────────────────────────────────────────
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

  // ── React Hook Form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProblemFormInput>({
    resolver: zodResolver(problemSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      difficulty: "easy",
      topic: "",
      problemDescription: "",
      constraint: "",
      inputFormat: "",
      outputFormat: "",
      testCases: [{ input: "", expected_output: "", is_hidden: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "testCases" });
  const testCases = watch("testCases");

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      let langs: string[] = [];
      try {
        const res = await codingProblemService.getAllSupportedLanguage();
        if (res.payload?.Languages) {
          langs = Object.values(res.payload.Languages) as string[];
        }
      } catch (err) {
        console.error("Failed to fetch languages", err);
      }
      if (langs.length === 0) langs = ["C++", "C", "Python", "JavaScript"];
      setAllLanguages(langs);

      if (isEditMode && editId) {
        setPageLoading(true);
        try {
          const res = await codingProblemService.getCodingProblemWithTestCases(editId, false);
          const editData: CodingProblemData = res.payload!.codingProblemWithTestCases!;

          setValue("title", editData.title);
          setValue("difficulty", (editData.difficulty?.toLowerCase() as any) || "easy");
          setValue("topic", Array.isArray(editData.topic) ? editData.topic.join(", ") : editData.topic);
          setValue("problemDescription", editData.problem_description);
          setValue("constraint", editData.constraint);
          setValue("inputFormat", editData.input_format);
          setValue("outputFormat", editData.output_format);

          const testCasesList = editData.testCases || [];
          if (testCasesList.length > 0) {
            setValue(
              "testCases",
              testCasesList.map((tc: any) => ({
                id: tc.id,
                input: tc.input,
                expected_output: tc.expected_output,
                is_hidden: tc.is_hidden,
              }))
            );
            const previews: { [key: number]: string } = {};
            testCasesList.forEach((tc: any, index: number) => {
              if (tc.image_url) previews[index] = tc.image_url;
            });
            setImagePreviews(previews);
          }

          if (editData.templateCodes && editData.templateCodes.length > 0) {
            const editLangs = [...new Set(editData.templateCodes.map((t) => t.language as string))];
            setOpenLangs(editLangs);
            setActiveLang(editLangs[0]);
            setTemplateCodes(editData.templateCodes);
          } else {
            // No templates — start empty, user must add manually
            setOpenLangs([]);
            setActiveLang("");
            setTemplateCodes([]);
          }
        } catch (err: any) {
          setIsError(true);
          setErrorMsg(err.response?.data?.message || "Failed to load problem");
        } finally {
          setPageLoading(false);
        }
      } else {
        // Create mode — start with no language selected
        setOpenLangs([]);
        setActiveLang("");
        setTemplateCodes([]);
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close lang dropdown on outside click ──────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Language template helpers ──────────────────────────────────────────────
  const monacoLang = (lang: string) => {
    const map: Record<string, string> = {
      "C++": "cpp", C: "c", Python: "python", PYTHON: "python",
      JavaScript: "javascript", JAVASCRIPT: "javascript", Java: "java", JAVA: "java",
    };
    return map[lang] || "plaintext";
  };

  const getTemplate = (lang: string) =>
    templateCodes.find((t) => t.language === lang)?.basic_code_layout || "";

  const handleEditorChange = (lang: string, value: string | undefined) => {
    setTemplateCodes((prev) => {
      const idx = prev.findIndex((t) => t.language === lang);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], basic_code_layout: value || "" };
        return updated;
      }
      return [...prev, { language: lang as any, basic_code_layout: value || "" }];
    });
    if (value && value.trim()) {
      setTemplateErrors((prev) => {
        const next = { ...prev };
        delete next[lang];
        return next;
      });
    }
  };

  const addLanguage = (lang: string) => {
    if (!openLangs.includes(lang)) {
      setOpenLangs((prev) => [...prev, lang]);
      setTemplateCodes((prev) => {
        if (prev.find((t) => t.language === lang)) return prev;
        return [...prev, { language: lang as any, basic_code_layout: "" }];
      });
    }
    setActiveLang(lang);
    setLangDropdownOpen(false);
  };

  const removeLanguage = async (lang: string) => {
    // Prevent removing if it's the last language
    if (openLangs.length <= 1) {
      toast.error("At least one language template is required");
      return;
    }

    const templateToRemove = templateCodes.find((t) => t.language === lang);

    if (templateToRemove?.id) {
      setDeletingTemplates(prev => ({ ...prev, [lang]: true }));
      try {
        const response = await codingProblemTemplateService.deleteCodingTemplateProblem(templateToRemove.id);
        if (response.success) {
          toast.success(`${lang} template removed successfully`);
        } else {
          toast.error(response.message || `Failed to delete ${lang} template`);
          return;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || `Failed to delete ${lang} template`);
        return;
      } finally {
        setDeletingTemplates(prev => ({ ...prev, [lang]: false }));
      }
    }

    const remaining = openLangs.filter((l) => l !== lang);
    setOpenLangs(remaining);
    setTemplateCodes((prev) => prev.filter((t) => t.language !== lang));
    setTemplateErrors((prev) => {
      const next = { ...prev };
      delete next[lang];
      return next;
    });
    if (activeLang === lang && remaining.length > 0) setActiveLang(remaining[0]);
  };

  const validateTemplates = (): boolean => {
    // Must have at least 1 language
    if (openLangs.length === 0) {
      toast.error("Please add at least one language template");
      return false;
    }

    const errs: Record<string, string> = {};
    openLangs.forEach((lang) => {
      const code = getTemplate(lang).trim();
      if (!code) errs[lang] = `Template for ${lang} is required`;
    });
    setTemplateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Test case helpers ──────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviews[index]) URL.revokeObjectURL(imagePreviews[index]);
      const url = URL.createObjectURL(file);
      setImagePreviews((prev) => ({ ...prev, [index]: url }));
    }
  };

  const removeImage = (index: number) => {
    if (imagePreviews[index]) URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleRemoveTestCase = async (index: number) => {
    const testCaseId = testCases[index]?.id;

    if (testCaseId) {
      setDeletingTestCases(prev => ({ ...prev, [index]: true }));
      try {
        const response = await testCaseService.deleteTestCase(testCaseId);
        if (response.success) {
          toast.success("Test case removed successfully");
        } else {
          toast.error(response.message || "Failed to delete test case");
          return;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete test case");
        return;
      } finally {
        setDeletingTestCases(prev => ({ ...prev, [index]: false }));
      }
    }

    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
      setImagePreviews((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
    remove(index);
  };

  const toggleVisibility = (index: number) => {
    setValue(`testCases.${index}.is_hidden`, !testCases[index]?.is_hidden);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: ProblemFormInput) => {
    if (!validateTemplates()) return;

    setSubmitLoading(true);
    setIsError(false);
    setErrorMsg("");

    const topicArray = data.topic.includes(",")
      ? data.topic.split(",").map((t) => t.trim()).filter(Boolean)
      : data.topic.trim() ? [data.topic.trim()] : [];

    const capitalizedDifficulty = (data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)) as "Easy" | "Medium" | "Hard";

    const filteredTemplateCodes = templateCodes
      .filter((t) => openLangs.includes(t.language as string) && t.basic_code_layout.trim() !== "")
      .map(({ id, language, basic_code_layout }) => {
        const template: any = { language, basic_code_layout };
        if (id) template.id = id;
        return template;
      });

    const problemData: CodingProblemData = {
      ...(isEditMode && editId && { id: editId }),
      title: data.title.trim(),
      difficulty: capitalizedDifficulty,
      topic: topicArray,
      problem_description: data.problemDescription.trim(),
      constraint: data.constraint.trim(),
      input_format: data.inputFormat.trim(),
      output_format: data.outputFormat.trim(),
      testCases: data.testCases.map((tc, idx) => ({
        ...(tc.id && { id: tc.id }),
        input: tc.input.trim(),
        expected_output: tc.expected_output.trim(),
        is_hidden: tc.is_hidden,
        ...(imagePreviews[idx] && { image_url: imagePreviews[idx] }),
      })),
      ...(filteredTemplateCodes.length > 0 && { templateCodes: filteredTemplateCodes }),
    };

    try {
      let res;
      if (isEditMode && editId) {
        res = await codingProblemService.updateCodingProblemWithTestCases(editId, problemData);
        toast.success("Problem Updated Successfully!");
      } else {
        res = await codingProblemService.createCodingProblemWithTestCases(problemData);
        toast.success("Problem Created Successfully!");
      }

      if (res?.success) {
        navigate("/admin/coding-problem");
      } else {
        toast.error(res?.message || "Operation failed");
        setIsError(true);
        setErrorMsg(res?.message || "Operation failed");
      }
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Page loading ───────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
      </div>
    );
  }

  const availableToAdd = allLanguages.filter((l) => !openLangs.includes(l));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Coding Problem" : "Create New Coding Problem"}
          </h1>
          <button
            onClick={() => navigate("/admin/coding-problem")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {isError && errorMsg && (
          <div className="mb-6 bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* ── Section 1: Problem Metadata ─────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Problem Metadata</h2>
            <div className="grid grid-cols-12 gap-5">

              {/* Title */}
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Title</label>
                <input
                  {...register("title")}
                  placeholder="e.g. Two Sum Problem"
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition-all ${errors.title ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Difficulty */}
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Difficulty</label>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as const).map((d) => {
                    const selected = watch("difficulty") === d;
                    const colors: Record<string, string> = {
                      easy: selected ? "bg-green-500 text-white border-green-500" : "border-gray-200 text-gray-600 hover:border-green-300",
                      medium: selected ? "bg-yellow-400 text-white border-yellow-400" : "border-gray-200 text-gray-600 hover:border-yellow-300",
                      hard: selected ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-300",
                    };
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValue("difficulty", d)}
                        className={`flex-1 py-2.5 border rounded-lg text-sm font-medium capitalize transition-all ${colors[d]}`}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    );
                  })}
                </div>
                {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty.message}</p>}
              </div>

              {/* Topics */}
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Topics</label>
                <TopicTagInput
                  value={watch("topic")}
                  onChange={(val) => setValue("topic", val, { shouldValidate: true })}
                  error={errors.topic?.message}
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Problem Details + Language Templates ─────── */}
          <div className="grid grid-cols-2 gap-6">

            {/* Problem Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-5">Problem Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Problem Description</label>
                  <TiptapEditor
                    height="300px" width="100%"
                    value={watch("problemDescription")}
                    onChange={(val) => setValue("problemDescription", val, { shouldValidate: true })}
                  />
                  {errors.problemDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.problemDescription.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Input Format</label>
                    <TiptapEditor
                      height="260px" width="100%"
                      value={watch("inputFormat")}
                      onChange={(val) => setValue("inputFormat", val, { shouldValidate: true })}
                    />
                    {errors.inputFormat && (
                      <p className="text-red-500 text-xs mt-1">{errors.inputFormat.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Output Format</label>
                    <TiptapEditor
                      height="260px" width="100%"
                      value={watch("outputFormat")}
                      onChange={(val) => setValue("outputFormat", val, { shouldValidate: true })}
                    />
                    {errors.outputFormat && (
                      <p className="text-red-500 text-xs mt-1">{errors.outputFormat.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Templates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-gray-800">Language Templates</h2>

                {/* Add language dropdown */}
                {availableToAdd.length > 0 && (
                  <div className="relative" ref={langDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setLangDropdownOpen((o) => !o)}
                      className="flex items-center gap-1.5 text-sm text-[#1DA077] border border-[#1DA077] rounded-lg px-3 py-1.5 hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Language
                    </button>
                    {langDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[150px] overflow-hidden">
                        {availableToAdd.map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => addLanguage(lang)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Language Tabs */}
              <div className="flex items-center gap-1 border-b border-gray-100 mb-4 flex-wrap min-h-[40px]">
                {openLangs.length === 0 && (
                  <p className="text-xs text-gray-400 py-2">No language added yet</p>
                )}
                {openLangs.map((lang) => (
                  <div key={lang} className="relative flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      disabled={deletingTemplates[lang]}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${
                        activeLang === lang
                          ? "border-b-2 border-[#1DA077] text-[#1DA077]"
                          : "text-gray-500 hover:text-gray-700"
                      } ${deletingTemplates[lang] ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {deletingTemplates[lang] ? "Removing..." : lang}
                    </button>
                    {/* Show remove button on all tabs — but blocked if last one */}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      disabled={deletingTemplates[lang]}
                      className={`ml-1 w-4 h-4 flex items-center justify-center rounded-full transition-colors ${
                        openLangs.length <= 1
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      } ${deletingTemplates[lang] ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={openLangs.length <= 1 ? "At least one language is required" : `Remove ${lang}`}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Monaco Editor or Empty State */}
              {openLangs.length === 0 ? (
                <div
                  className="border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-8"
                  style={{ height: "260px" }}
                >
                  <svg className="w-8 h-8 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className="text-sm font-medium text-gray-400">No language added yet</p>
                  <p className="text-xs text-gray-300 mt-1">Click "Add Language" above to get started</p>
                </div>
              ) : (
                <div
                  className={`border rounded-xl overflow-hidden ${templateErrors[activeLang] ? "border-red-400" : "border-gray-200"}`}
                  style={{ height: "260px" }}
                >
                  <Editor
                    key={activeLang}
                    height="100%"
                    width="100%"
                    language={monacoLang(activeLang)}
                    value={getTemplate(activeLang)}
                    onChange={(val) => handleEditorChange(activeLang, val)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                      lineNumbers: "on",
                      glyphMargin: false,
                      folding: true,
                      renderValidationDecorations: "off",
                      scrollbar: { vertical: "visible", horizontal: "visible" },
                    }}
                    theme="vs-dark"
                    loading={
                      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
                        Loading editor...
                      </div>
                    }
                  />
                </div>
              )}

              {/* Status text & error — only when a lang is active */}
              {openLangs.length > 0 && (
                <>
                  {templateErrors[activeLang] && (
                    <p className="text-red-500 text-xs mt-1">{templateErrors[activeLang]}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1.5 mb-4">
                    {activeLang} template — {getTemplate(activeLang).trim() ? "✓ saved" : "empty"}
                  </p>
                </>
              )}

              {/* No language warning */}
              {openLangs.length === 0 && (
                <p className="text-xs text-amber-500 mt-2 mb-4">
                  ⚠️ At least one language template is required to publish
                </p>
              )}

              {/* Constraint */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Constraint</label>
                <TiptapEditor
                  height="270px" width="100%"
                  value={watch("constraint")}
                  onChange={(val) => setValue("constraint", val, { shouldValidate: true })}
                />
                {errors.constraint && (
                  <p className="text-red-500 text-xs mt-1">{errors.constraint.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 3: Test Case Manager ────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-5">Test Case Manager</h2>

            {errors.testCases && (
              <div className="mb-4 bg-red-50 text-red-500 p-2.5 rounded-lg text-sm border border-red-100">
                ⚠️ {errors.testCases.message}
              </div>
            )}

            <div className="grid grid-cols-12 gap-3 mb-2 px-1">
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Test Case</div>
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Input</div>
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected Output</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Hidden</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Image</div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Actions</div>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-start bg-gray-50 rounded-xl p-3">
                  <div className="col-span-1 flex items-center justify-center h-full pt-2">
                    <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  </div>
                  <div className="col-span-4">
                    <textarea
                      {...register(`testCases.${index}.input`)}
                      placeholder="Input"
                      rows={2}
                      disabled={deletingTestCases[index]}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white  resize-none outline-none focus:border-gray-400 transition-all ${
                        errors.testCases?.[index]?.input ? "border-red-400" : "border-gray-200"
                      } ${deletingTestCases[index] ? "opacity-50 bg-gray-100" : ""}`}
                    />
                    {errors.testCases?.[index]?.input && (
                      <p className="text-red-500 text-xs mt-0.5">{errors.testCases[index]?.input?.message}</p>
                    )}
                  </div>
                  <div className="col-span-4">
                    <textarea
                      {...register(`testCases.${index}.expected_output`)}
                      placeholder="Expected Output"
                      rows={2}
                      disabled={deletingTestCases[index]}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white  resize-none outline-none focus:border-gray-400 transition-all ${
                        errors.testCases?.[index]?.expected_output ? "border-red-400" : "border-gray-200"
                      } ${deletingTestCases[index] ? "opacity-50 bg-gray-100" : ""}`}
                    />
                    {errors.testCases?.[index]?.expected_output && (
                      <p className="text-red-500 text-xs mt-0.5">{errors.testCases[index]?.expected_output?.message}</p>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-2">
                    <input
                      type="checkbox"
                      checked={testCases[index]?.is_hidden ?? false}
                      onChange={() => toggleVisibility(index)}
                      disabled={deletingTestCases[index]}
                      className="w-4 h-4 accent-[#1DA077] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-1">
                    {imagePreviews[index] ? (
                      <div className="relative">
                        <img src={imagePreviews[index]} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={deletingTestCases[index]}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 transition disabled:opacity-50"
                        >×</button>
                      </div>
                    ) : (
                      <label className={`flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap ${
                        deletingTestCases[index] ? "opacity-50 cursor-not-allowed" : ""
                      }`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, index)} disabled={deletingTestCases[index]} />
                      </label>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-2">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(index)}
                        disabled={deletingTestCases[index]}
                        className={`text-red-400 hover:text-red-600 transition-colors ${deletingTestCases[index] ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ input: "", expected_output: "", is_hidden: true })}
              className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#1DA077] hover:text-[#1DA077] transition-colors"
            >
              + Add Test Case
            </button>
          </div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate("/admin/coding-problem")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || Object.keys(deletingTemplates).some(k => deletingTemplates[k]) || Object.keys(deletingTestCases).some(k => deletingTestCases[Number(k)])}
              className="px-8 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Saving..." : isEditMode ? "Update Problem" : "Publish Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCodingProblemPage;