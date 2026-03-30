import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import codingProblemService from "../../services/codingProblem.services";
import type { CodingProblemData } from "../../types/codingProblem.types";
import { toast } from "react-toastify";
import ProblemCardSkeleton from "../../skeleton/ProblemCardSkeleton";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

/* ─── icons ───────────────────────────────────────────────────────────── */
const IconSearch = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const IconEdit = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4 1 1-4 12.362-12.726z"
    />
  </svg>
);
const IconDelete = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);
const IconEmpty = () => (
  <svg
    width="28"
    height="28"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

/* ─── difficulty badge ────────────────────────────────────────────────── */
type DiffKey = "easy" | "medium" | "hard";

const diffConfig: Record<DiffKey, { pill: string; dot: string }> = {
  easy: {
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  medium: {
    pill: "bg-amber-50   text-amber-700   border border-amber-200",
    dot: "bg-amber-500",
  },
  hard: {
    pill: "bg-rose-50    text-rose-700    border border-rose-200",
    dot: "bg-rose-500",
  },
};

const DiffBadge: React.FC<{ difficulty?: string }> = ({ difficulty }) => {
  const key = (difficulty ?? "").toLowerCase() as DiffKey;
  const cfg = diffConfig[key];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${cfg.pill}`}
    >
      <span
        className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${cfg.dot}`}
      />
      {difficulty}
    </span>
  );
};

/* ─── filter config ───────────────────────────────────────────────────── */
type FilterKey = "all" | DiffKey;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

/* ─── component ───────────────────────────────────────────────────────── */
const CodingProblem: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<CodingProblemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await codingProblemService.getAllCodingProblems();
      setProblems(res.payload?.codingProblemList ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleCreate = () =>
    navigate("/admin/coding-problem/create-coding-problem");

  const handleUpdate = (id: string) =>
    navigate(`/admin/coding-problem/create-coding-problem?id=${id}&mode=edit`);

  const handleDelete = async (id: string) => {
    setFormLoading(true);
    try {
      await codingProblemService.deleteCodingProblem(id);
      toast.success("Problem deleted.");
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete problem");
    } finally {
      setFormLoading(false);
    }
  };

  const counts = useMemo(
    () => ({
      all: problems.length,
      easy: problems.filter((p) => p.difficulty?.toLowerCase() === "easy")
        .length,
      medium: problems.filter((p) => p.difficulty?.toLowerCase() === "medium")
        .length,
      hard: problems.filter((p) => p.difficulty?.toLowerCase() === "hard")
        .length,
    }),
    [problems],
  );

  const filtered = useMemo(
    () =>
      problems.filter((p) => {
        const q = search.toLowerCase();
        const topicStr = Array.isArray(p.topic)
          ? p.topic.join(" ")
          : (p.topic ?? "");
        const matchQ =
          p.title?.toLowerCase().includes(q) ||
          topicStr.toLowerCase().includes(q);
        const matchF =
          filter === "all" || p.difficulty?.toLowerCase() === filter;
        return matchQ && matchF;
      }),
    [problems, search, filter],
  );

  const topicLabel = (t?: string | string[]) =>
    Array.isArray(t) ? t.join(", ") : (t ?? "—");

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* error banner */}
      {error && (
        <div className="bg-[#fff1f2] border-b border-[#fecdd3] px-5 py-2.5 flex items-center gap-2 text-[#dc2626] text-xs">
          <span>⚠</span> {error}
          <button
            onClick={() => setError("")}
            className="ml-auto bg-transparent border-none text-[#dc2626] text-xs underline p-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 py-8 max-w-screen-2xl mx-auto">
        {/* ── header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#b0b8c4] uppercase mb-1.5">
              Admin · Code management
            </p>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
              Code management
            </h1>
            <p className="text-[13px] text-gray-400 mt-1">
              Manage technical problems for assessments.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="cursor-pointer group self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1DA077] transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#16906a] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(29,160,119,0.35)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(29,160,119,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            Create Problem
          </button>
        </div>

        {/* ── stats row ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: "Total", value: counts.all },
            { label: "Easy", value: counts.easy, dot: "bg-emerald-400" },
            { label: "Medium", value: counts.medium, dot: "bg-amber-400" },
            { label: "Hard", value: counts.hard, dot: "bg-red-400" },
          ].map(({ label, value, dot }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white border border-[#e8eaed] rounded-[10px] px-3.5 py-[7px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              {dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}
                />
              )}
              <span className="text-[12px] font-medium text-gray-400">
                {label}
              </span>
              <span className="text-[14px] font-bold text-gray-900 ml-0.5">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* thin divider */}
        <div className="h-px bg-[#eaecef] mb-5" />

        {/* ── toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center mb-5">
          <div className="relative flex-1 min-w-[160px]">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#e2e5e9] rounded-[9px] text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#1DA077] focus:ring-2 focus:ring-[#1DA077]/10 transition"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(({ key, label }) => {
              const activeMap = {
                all: "bg-gray-900 text-white border-gray-900",
                easy: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
                medium: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
                hard: "bg-[#fff1f2] text-[#dc2626] border-[#fecdd3]",
              };
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-100 ${
                    filter === key
                      ? activeMap[key]
                      : "bg-white text-gray-500 border-[#e2e5e9] hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── column headers ── */}
        {!loading && filtered.length > 0 && (
          <div className="hidden sm:grid grid-cols-[28px_1fr_100px_150px_100px] gap-x-3 px-4 pb-2.5 text-[10px] font-bold tracking-[0.09em] text-[#c4c9d4] uppercase border-b border-[#f0f1f3]">
            <span />
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Topic</span>
            <span />
          </div>
        )}

        {/* ── list ── */}
        {loading ? (
          <div className="flex flex-col gap-2 mt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProblemCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-11 h-11 rounded-[14px] bg-gray-100 flex items-center justify-center mb-3 text-gray-300 text-lg">
              <IconEmpty />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              No problems found
            </p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-xs">
              {search || filter !== "all"
                ? "Try adjusting your search or filter."
                : 'Click "Create problem" to add the first one.'}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-[3px] mt-1 list-none p-0 m-0">
            {filtered.map((problem, idx) => (
              <li
                key={problem.id}
                className="group grid grid-cols-[28px_1fr_64px] sm:grid-cols-[28px_1fr_100px_150px_100px] gap-x-3 items-center px-4 py-3 rounded-xl bg-[#fafafa] border border-[#eaecef] hover:bg-white hover:border-[#d1d5db] hover:shadow-[0_2px_8px_rgba(0,0,0,0.055)] transition-all duration-150"
              >
                {/* index */}
                <span className="text-[10px] font-bold text-gray-300 text-right select-none tracking-[0.02em]">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* title */}
                <div className="min-w-0">
                  <p className="m-0 text-[13px] font-semibold text-gray-800 tracking-[-0.01em] truncate">
                    {problem.title}
                  </p>
                  {/* topic visible only on mobile below title */}
                  <p className="sm:hidden m-0 mt-0.5 text-[11px] text-gray-400 truncate">
                    {topicLabel(problem.topic)}
                  </p>
                </div>

                {/* difficulty */}
                <div className="flex items-center">
                  <DiffBadge difficulty={problem.difficulty} />
                </div>

                {/* topic — desktop only, never truncates */}
                <div className="hidden sm:flex items-center min-w-0">
                  <span className="inline-flex items-center px-2 py-[3px] rounded-md bg-gray-100 text-[11px] font-medium text-gray-500 whitespace-nowrap">
                    {topicLabel(problem.topic)}
                  </span>
                </div>

                {/* actions */}
                <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => handleUpdate(problem.id!)}
                    disabled={formLoading}
                    title="Edit"
                    className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-400 hover:bg-[#eff6ff] hover:border-[#bfdbfe] hover:text-blue-600 transition-all duration-100 disabled:opacity-40"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProblemId(problem.id!);
                      setOpenDeleteDialog(true);
                    }}
                    disabled={formLoading}
                    title="Delete"
                    className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-400 hover:bg-[#fff1f2] hover:border-[#fecdd3] hover:text-[#dc2626] transition-all duration-100 disabled:opacity-40"
                  >
                    <IconDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ── footer ── */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-[12px] text-[#b0b8c4] mt-6">
            Showing{" "}
            <span className="font-semibold text-gray-500">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-500">
              {problems.length}
            </span>{" "}
            problems
          </p>
        )}
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent
          size="sm"
          className="rounded-2xl border border-gray-100 shadow-lg"
        >
          <AlertDialogHeader className="space-y-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-rose-700" strokeWidth={1.8} />
              </div>
              <AlertDialogTitle className="text-[15px] font-medium text-gray-900">
                Delete Problem
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="text-[13px] text-gray-500 leading-relaxed">
              Are you sure you want to delete this problem? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-1 sm:space-x-0 gap-2">
            <AlertDialogCancel className="h-8 px-4 text-[13px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none m-0">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                if (!selectedProblemId) return;
                await handleDelete(selectedProblemId);
                setOpenDeleteDialog(false);
                setSelectedProblemId(null);
              }}
              className="h-8 px-4 text-[13px] font-medium rounded-lg bg-rose-700 hover:bg-rose-800 text-white shadow-none m-0 flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" strokeWidth={2} />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CodingProblem;
