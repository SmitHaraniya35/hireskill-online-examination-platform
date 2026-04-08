import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import testLinkService from "../../services/test.services";
import TestCardSkeleton from "../../skeleton/TestCardSkeleton";

import type { Test, TestList } from "../../types/test.types";
import type { axiosResponse } from "../../types/index.types";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { IconView, IconEdit, IconDelete } from "../../components/icons";
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
import CopyToken from "./CopyToken";

const TestManager: React.FC = () => {
  const navigate = useNavigate();
  const [testList, setTestList] = useState<Test[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const loadLinks = async () => {
    try {
      const res: axiosResponse<TestList> = await testLinkService.getAllTest();
      setTestList(res.payload?.testList || []);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleToggleActivation = async (id: string) => {
    try {
      const res = await testLinkService.toggleActivation(id);
      const updatedTest = res.payload?.test;
      setTestList((prev) =>
        prev?.map((test) =>
          test.id === id ? { ...test, ...updatedTest } : test,
        ),
      );
      toast.success(
        updatedTest?.is_active ? "Test Activated" : "Test Deactivated",
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  const handleTogglePublicStatus = async (id: string) => {
    try {
      const res = await testLinkService.togglePublicStatus(id);
      const updatedTest = res.payload?.test;
      setTestList((prev) =>
        prev?.map((test) =>
          test.id === id ? { ...test, ...updatedTest } : test,
        ),
      );
      toast.success(updatedTest?.is_public ? "Test Publiced" : "Test Privated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  const handleCreate = () => {
    navigate("/admin/create-exam/create-new-test");
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/create-exam/create-new-test?editId=${id}`);
  };

  const confirmDelete = async () => {
    if (!selectedTestId) return;

    try {
      await testLinkService.deleteTest(selectedTestId);

      toast.success("Test Deleted Successfully!");

      setTestList((prev) => prev!.filter((link) => link.id !== selectedTestId));
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to delete test");
    } finally {
      setOpenDeleteDialog(false);
      setSelectedTestId(null);
    }
  };

  if (isError) {
    return (
      <div className="bg-[#fff1f2] border-b border-[#fecdd3] px-5 py-2.5 flex items-center gap-2 text-[#dc2626] text-xs">
        <span>⚠</span> {errorMsg}
        <button
          onClick={() => setErrorMsg("")}
          className="ml-auto bg-transparent border-none text-[#dc2626] text-xs underline p-0 cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 py-8 max-w-screen-2xl mx-auto">
        {/* ── Page Header ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Test management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage test links and settings for all assessments
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="group cursor-pointer self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1DA077] transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#16906a] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(29,160,119,0.35)] active:translate-y-0 active:shadow-[0_3px_8px_rgba(29,160,119,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
            Create Test
          </button>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <TestCardSkeleton key={index} />
            ))}
          </div>
        ) : testList?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-5 h-5 text-gray-300" />
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-gray-500">No tests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testList!.map((link) => {
              const now = new Date();
              const startTime = new Date(link.start_at || ""); // Assuming start_at is always provided, otherwise handle accordingly
              const expiryTime = new Date(link.expiration_at);

              // Check if current time is within the test window
              const isLive = now >= startTime && now <= expiryTime;
              return (
                <div
                  key={link.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-5 flex items-center justify-between gap-4"
                >
                  {/* ── LEFT: Title + meta ───────────────────── */}
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 overflow-hidden">
                      <span className="truncate">
                        {link.title || "Untitled"}
                      </span>

                      {isLive && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-rose-600 flex-shrink-0">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                          Live
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {/* Expiry date */}
                      <span className="inline-flex items-center gap-1.5 text-[14px] text-gray-500">
                        <svg
                          className="w-3.5 h-3.5 shrink-0 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {new Date(link.expiration_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>

                      {/* Divider dot */}
                      <span className="w-1 h-1 rounded-full bg-gray-200 shrink-0" />

                      {/* Duration */}
                      <span className="inline-flex items-center gap-1.5 text-[14px] text-gray-500">
                        <svg
                          className="w-3.5 h-3.5 shrink-0 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {link.duration_minutes} mins
                      </span>
                    </div>
                  </div>

                  {/* ── RIGHT: Icons row + Toggles row ───────── */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    {/* Row 1 — Action icons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() =>
                          navigate(`/admin/tests/${link.id}/attempts`)
                        }
                        title="View student attempts"
                        className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#f0fdf4] hover:border-[#bbf7d0] hover:text-[#16a34a] transition-all duration-150"
                      >
                        <IconView />
                      </button>

                      {/* Edit Button */}
                      {/* <button
                      onClick={() => handleEdit(link.id!)}
                      title="Edit test"
                      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#eff6ff] hover:border-[#bfdbfe] hover:text-blue-600 transition-all duration-150"
                    >
                      <IconEdit />
                    </button> */}
                      <button
                        disabled={ link.is_active && isLive}
                        onClick={() => {
                          if (!isLive || !link.is_active  ) {
                            handleEdit(link.id!);
                          }
                        }}
                        title={isLive ? "Cannot edit live test" : "Edit test"}
                        className={`w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 transition-all duration-150 ${
                          isLive && link.is_active
                            ? "opacity-40 cursor-not-allowed grayscale"
                            : "cursor-pointer hover:bg-[#eff6ff] hover:border-[#bfdbfe] hover:text-blue-600"
                        }`}
                      >
                        <IconEdit />
                      </button>

                      {/* Delete Button */}
                      {/* <button
                      onClick={() => {
                        setSelectedTestId(link.id!);
                        setOpenDeleteDialog(true);
                      }}
                      title="Delete test"
                      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 hover:bg-[#fff1f2] hover:border-[#fecdd3] hover:text-[#dc2626] transition-all duration-150"
                    >
                      <IconDelete />
                    </button> */}
                      <button
                        disabled={isLive && link.is_active}
                        onClick={() => {
                          if (!isLive || !link.is_active) {
                            setSelectedTestId(link.id!);
                            setOpenDeleteDialog(true);
                          }
                        }}
                        title={
                          isLive ? "Cannot delete live test" : "Delete test"
                        }
                        className={`w-7 h-7 flex items-center justify-center rounded-[7px] border border-[#e2e5e9] bg-white text-gray-700 transition-all duration-150 ${
                          isLive && link.is_active
                            ? "opacity-40 cursor-not-allowed grayscale"
                            : "cursor-pointer hover:bg-[#fff1f2] hover:border-[#fecdd3] hover:text-[#dc2626]"
                        }`}
                      >
                        <IconDelete />
                      </button>
                      {link.unique_token && (
                        <CopyToken token={link.unique_token} />
                      )}
                    </div>

                    {/* Row 2 — Toggle buttons */}
                    <div className="flex items-center gap-2">
                      {/* Toggle: Active */}
                      <button
                        type="button"
                        title={
                          link.is_active ? "Deactivate Test" : "Activate Test"
                        }
                        onClick={() => handleToggleActivation(link.id!)}
                        className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-200 ${
                          link.is_active
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-gray-50 border-gray-100 text-gray-400"
                        }`}
                      >
                        <span
                          className={`relative inline-flex w-6 h-3.5 rounded-full transition-colors duration-200 shrink-0 ${
                            link.is_active ? "bg-emerald-400" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                              link.is_active
                                ? "translate-x-2.5"
                                : "translate-x-0"
                            }`}
                          />
                        </span>
                        Active
                      </button>

                      {/* Toggle: Public */}
                      <button
                        type="button"
                        title={link.is_public ? "Make Private" : "Make Public"}
                        onClick={() => handleTogglePublicStatus(link.id!)}
                        className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-200 ${
                          link.is_public
                            ? "bg-sky-50 border-sky-100 text-sky-700"
                            : "bg-gray-50 border-gray-100 text-gray-400"
                        }`}
                      >
                        <span
                          className={`relative inline-flex w-6 h-3.5 rounded-full transition-colors duration-200 shrink-0 ${
                            link.is_public ? "bg-sky-400" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                              link.is_public
                                ? "translate-x-2.5"
                                : "translate-x-0"
                            }`}
                          />
                        </span>
                        Public
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                Delete test?
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="text-[13px] text-gray-500 leading-relaxed">
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-1 sm:space-x-0 gap-2">
            <AlertDialogCancel className="h-8 px-4 text-[13px] font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-none m-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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

export default TestManager;
