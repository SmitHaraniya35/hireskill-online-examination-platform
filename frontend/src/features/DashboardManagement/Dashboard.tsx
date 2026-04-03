import { useState, lazy, Suspense } from "react";
import { RefreshCcw } from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";
import { LoadingSkeleton, Icons } from "./components/dashboard.components";
import { relDate } from "./utils/dashboard.utils";

const GlobalView = lazy(() => import("./views/GlobalView"));
const SingleTestView = lazy(() => import("./views/SingleTestView"));

export default function Dashboard() {
  const {
    view,
    tests,
    selectedId,
    globalData,
    singleData,
    loading,
    error,
    handleSelect,
    handleGlobal,
    refresh,
  } = useDashboardData();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentTitle =
    view === "global"
      ? "Global Analytics"
      : (singleData?.test?.title ?? "Test Analytics");

  const currentSub =
    view === "single" && singleData
      ? `${relDate(singleData.test.start_at)} · ${singleData.test.duration_minutes} min · ${singleData.test.total_score} pts`
      : undefined;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-[#f5f6f8] backdrop-blur-sm border-r border-gray-200 flex flex-col sticky top-0 h-screen transition-all duration-300 overflow-hidden ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1DA077] to-[#158563] flex items-center justify-center shrink-0 shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 21L11 13L15 17L19 9"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-[16px] text-gray-900 whitespace-nowrap tracking-tight">
                TestMetrics
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded transition-colors shrink-0"
          >
            <Icons.Chevron open={sidebarOpen} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1">
          <button
            onClick={handleGlobal}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 ${
              view === "global"
                ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-[#1DA077] shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            title="Global Overview"
          >
            <span className="shrink-0">
              <Icons.Globe />
            </span>
            {sidebarOpen && (
              <span className="text-[14px] font-medium truncate">
                Dashboard
              </span>
            )}
          </button>

          {sidebarOpen && (
            <p className="text-[11px] uppercase tracking-widest text-gray-500 px-3 pt-4 pb-2">
              Recent Tests
            </p>
          )}

          {/* {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 ${
                selectedId === t.id && view === "single"
                  ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-[#1DA077] shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title={t.title}
            >
              <span className="shrink-0">
                <Icons.Test />
              </span>
              {sidebarOpen && (
                <span className="flex flex-col min-w-0 flex-1">
                  <span className="text-[14px] font-medium truncate leading-tight">
                    {t.title}
                  </span>
                  <span className="text-[12px] mt-1 text-gray-600 leading-tight tabular-nums">
                    {relDate(t.start_at)}
                  </span>
                </span>
              )}
            </button>
          ))} */}
          {[...tests]
            .sort(
              (a, b) =>
                new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
            )
            .map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 ${
                  selectedId === t.id && view === "single"
                    ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-[#1DA077] shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title={t.title}
              >
                <span className="shrink-0">
                  <Icons.Test />
                </span>
                {sidebarOpen && (
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium truncate leading-tight">
                      {t.title}
                    </span>
                    <span className="text-[12px] mt-1 text-gray-600 leading-tight tabular-nums">
                      {relDate(t.start_at)}
                    </span>
                  </span>
                )}
              </button>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-[#f5f6f8] backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 py-4 shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentTitle}
            </h1>
            {currentSub && (
              <span className="text-[11px] text-gray-400 tabular-nums">
                {currentSub}
              </span>
            )}
          </div>
          <button
            onClick={refresh}
            className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <Suspense fallback={<LoadingSkeleton />}>
              {view === "global" && globalData ? (
                <GlobalView data={globalData} onTestClick={handleSelect} />
              ) : view === "single" && singleData ? (
                <SingleTestView data={singleData} />
              ) : null}
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
