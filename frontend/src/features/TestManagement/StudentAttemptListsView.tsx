import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentAttemptService from "../../services/studentAttempt.services";
import StudentAttemptListSkeleton from "../../skeleton/StudentAttemptListSkeleton";
import CustomTable from "../../components/shared/CustomTable";
import type { GetStudentAttempts } from "../../types/studentAttempts.types";
import { toast } from "react-toastify";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { IconDelete, IconView } from "../../components/icons";
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

const StudentAttemptListView: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [studentAttempts, setStudentAttempts] = useState<GetStudentAttempts[]>(
    [],
  );
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  const formatDateDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDurationMs = (start: string, end: string | null): number => {
    if (!end) return Infinity;
    return Math.max(0, new Date(end).getTime() - new Date(start).getTime());
  };

  const applyDefaultSorting = (
    data: GetStudentAttempts[],
  ): GetStudentAttempts[] => {
    return [...data].sort((a, b) => {
      const aResult = a.result
        ? (a.result.achieved_score / a.result.total_score) * 100
        : 0;
      const bResult = b.result
        ? (b.result.achieved_score / b.result.total_score) * 100
        : 0;
      if (Math.abs(aResult - bResult) > 0.001) return bResult - aResult;
      return (
        calculateDurationMs(a.started_at, a.finished_at) -
        calculateDurationMs(b.started_at, b.finished_at)
      );
    });
  };

  const fetchAttempts = useCallback(
    async (showRefreshing = false) => {
      if (!testId) return;
      if (showRefreshing){
        setIsRefreshing(true);
        setIsRefreshing(true);
      } 
      try {
        const res =
          await studentAttemptService.getStudentAttemptsDetails(testId);
        setStudentAttempts(applyDefaultSorting(res.payload!.students));
      } catch (err: any) {
        toast.error(err.response.data.message || "Failed to fetch student attempts");
      } finally {
        setAttemptLoading(false);
        setIsRefreshing(false);
      }
    },
    [testId],
  );

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  const handleView = (id: string) => navigate(`/submission/${id}`);
  const confirmDelete = async () => {
    if (!selectedAttemptId) return;

    try {
      await studentAttemptService.deleteStudentAttempt(selectedAttemptId);

      toast.success("Student attempt deleted successfully!");

      setStudentAttempts((prev) =>
        applyDefaultSorting(
          prev.filter((attempt) => attempt.id !== selectedAttemptId),
        ),
      );
    } catch {
      toast.error("Failed to delete student attempt");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedAttemptId(null);
    }
  };

  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return <span className="text-gray-300 italic">N/A</span>;
    const diffInMs = Math.max(
      0,
      new Date(end).getTime() - new Date(start).getTime(),
    );
    const seconds = Math.floor((diffInMs / 1000) % 60);
    const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return (
      <span className="font-medium text-gray-700 tabular-nums">
        {parts.join(" ")}
      </span>
    );
  };

  // Date+time cell — compact two-line layout
  const DateCell = ({ iso }: { iso: string | null }) => {
    if (!iso) return <span className="text-gray-300 italic">—</span>;
    return (
      <div className="leading-tight">
        <div className="font-medium text-gray-700">
          {formatDateDDMMYYYY(iso)}
        </div>
        <div className="text-[10px] text-gray-400 tabular-nums">
          {new Date(iso).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      // ── # ──────────────────────────── 
      {
        header: "#",
        width: "5%",
        align: "center" as const,
        accessor: (_row: GetStudentAttempts, index: number) => (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
            {index}
          </span>
        ),
      },
      // ── Name ───────────────────────── 
      {
        header: "Name",
        width: "12%",
        accessor: (row: GetStudentAttempts) => (
          <span title={row.student?.name} className="font-semibold text-gray-800 capitalize truncate block">
            {row.student?.name}
          </span>
        ),
      },
      // ── Email ────────────────────────
      {
        header: "Email",
        width: "12%",
        accessor: (row: GetStudentAttempts) => (
          <span title={row.student?.email} className="text-gray-500 truncate block">
            {row.student?.email}
          </span>
        ),
      },
      // ── Phone ────────────────────────
      {
        header: "Phone",
        width: "10%",
        accessor: (row: GetStudentAttempts) => (
          <span title={String(row.student?.phone)} className="tabular-nums text-gray-600">
            {row.student?.phone}
          </span>
        ),
      },
      // ── Started ──────────────────────
      {
        header: "Started",
        width: "10%",
        accessor: (row: GetStudentAttempts) => (
          <DateCell iso={row.started_at} />
        ),
      },
      // ── Expiry ───────────────────────
      {
        header: "Expiry",
        width: "10%",
        accessor: (row: GetStudentAttempts) => (
          <DateCell iso={row.expires_at} />
        ),
      },
      // ── Finished ─────────────────────
      {
        header: "Finished",
        width: "10%",
        accessor: (row: GetStudentAttempts) => (
          <DateCell iso={row.finished_at ?? null} />
        ),
      },
      // ── Status ───────────────────────
      {
        header: "Status",
        width: "14%",
        align: "left" as const,
        accessor: (row: GetStudentAttempts) => {
          const statusMap: Record<
            string,
            { bg: string; text: string; dot: string }
          > = {
            Submitted: {
              bg: "bg-emerald-50",
              text: "text-emerald-700",
              dot: "bg-emerald-500",
            },
            "Auto Submitted": {
              bg: "bg-violet-50",
              text: "text-violet-700",
              dot: "bg-violet-500",
            },
            "In Progress": {
              bg: "bg-amber-50",
              text: "text-amber-700",
              dot: "bg-amber-400",
            },
            Processing: {
              bg: "bg-sky-50",
              text: "text-sky-700",
              dot: "bg-sky-500",
            },
            "Violation Detected": {
              bg: "bg-rose-50",
              text: "text-rose-700",
              dot: "bg-rose-500",
            }
          };
          const style = statusMap[row.status] ?? {
            bg: "bg-gray-100",
            text: "text-gray-600",
            dot: "bg-gray-400",
          };
          return (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}
              />
              {row.status}
            </span>
          );
        },
      },
      // ── Result ───────────────────────
      {
        header: "Result",
        width: "10%",
        align: "center" as const,
        accessor: (row: GetStudentAttempts) => {
          const result = row.result;
          if (!result) return <span className="text-gray-300 italic">N/A</span>;
          const pct = (result.achieved_score / result.total_score) * 100;
          return (
            <div className="text-center leading-tight">
              <div className={`font-bold tabular-nums`}>{pct.toFixed(1)}%</div>
              <div className="text-[10px] text-gray-400 tabular-nums">
                {result.achieved_score}/{result.total_score}
              </div>
            </div>
          );
        },
      },
      // ── Time ─────────────────────────
      {
        header: "Time Taken",
        width: "8%",
        align: "center" as const,
        accessor: (row: GetStudentAttempts) =>
          calculateDuration(row.started_at, row.finished_at),
      },
      // ── Actions ──────────────────────
      {
        header: "Actions",
        width: "7%",
        align: "center" as const,
        accessor: (row: GetStudentAttempts) => {
          const isDisabled =
            row.status === "Processing" || row.status === "In Progress";
          return (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => !isDisabled && handleView(row.id!)}
                disabled={isDisabled}
                title={
                  isDisabled ? "Cannot view while processing" : "View attempt"
                }
                className={`w-9 h-5 flex items-center justify-center rounded-[7px] border bg-white transition-all duration-150 ${
                  isDisabled
                    ? "border-[#e2e5e9] text-gray-300 cursor-not-allowed"
                    : "cursor-pointer border-[#e2e5e9] text-gray-700 hover:bg-[#f0fdf4] hover:border-[#bbf7d0] hover:text-[#16a34a]"
                }`}
              >
                <IconView className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedAttemptId(row.id!);
                  setOpenDeleteDialog(true);
                }}
                title="Delete attempt"
                className="cursor-pointer w-20 h-5 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#fff1f2] hover:border-[#fecdd3] hover:text-[#dc2626] transition-all duration-150"
              >
                <IconDelete />
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 py-8 max-w-screen-2xl mx-auto">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Student Attempts
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {studentAttempts.length} submission
              {studentAttempts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAttempts(true)}
              disabled={isRefreshing}
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#1DA077]" : ""}`}
              />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </button>

            <button
              onClick={() => navigate("/admin/create-exam")}
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Tests
            </button>
          </div>
        </div>

        {/* ── Table Card ─────────────────────────────────────── */}
        {attemptLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <StudentAttemptListSkeleton key={i} />
            ))}
          </div>
        ) : (
          <CustomTable<GetStudentAttempts>
            data={studentAttempts}
            columns={columns as any}
            pageSize={10}
          />
        )}
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent size="sm" className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              Delete Attempt?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm text-gray-500">
              Are you sure you want to delete this student attempt? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-700 hover:bg-rose-800 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentAttemptListView;
