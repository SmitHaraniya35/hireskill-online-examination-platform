import React, { useMemo, useState } from "react";

interface Column<T> {
  header: string;
  accessor: ((row: T, index?: number) => React.ReactNode) | keyof T;
  sortable?: boolean;
  width?: string;
  /** Align cell content. Defaults to "left" */
  align?: "left" | "center" | "right";
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
}

function CustomTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
}: CustomTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);

  const deepSearch = (obj: any, target: string): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((val) => {
      if (typeof val === "object" && val !== null)
        return deepSearch(val, target);
      return String(val).toLowerCase().includes(target.toLowerCase());
    });
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter((row) => deepSearch(row, search));
  }, [data, search]);

  const sortedData = useMemo(() => filteredData, [filteredData]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const allPageIds = paginatedData.map((row) => row.id);
  const allPageSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));
  const somePageSelected = allPageIds.some((id) => selectedIds.has(id));

  const toggleAll = () => {
    if (allPageSelected) {
      onSelectionChange?.(new Set());
    } else {
      const allIds = new Set(sortedData.map((row) => row.id));
      onSelectionChange?.(allIds);
    }
  };

  const handleClearAll = () => {
    onSelectionChange?.(new Set());
    setSelectAll(false);
  };

  const toggleRow = (id: string | number) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectionChange?.(next);
  };

  const alignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email…"
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1DA077]/25 focus:border-[#1DA077] transition-all duration-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              setSelectAll(false);
              onSelectionChange?.(new Set());
            }}
          />
        </div>

        {selectable && selectedIds.size > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1DA077]/10 text-[#1DA077] border border-[#1DA077]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DA077] inline-block" />
            {selectedIds.size} selected
          </span>
        )}
      </div>

      {/* ── Select-All Banner ───────────────────────────────── */}
      {selectable && selectAll && (
        <div className="px-5 py-2 bg-gradient-to-r from-[#1DA077]/5 to-emerald-50 border-b border-[#1DA077]/10 flex items-center justify-between">
          <span className="text-xs text-[#1DA077] font-medium">
            All <strong>{sortedData.length}</strong> students are selected.
          </span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline underline-offset-2 transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="w-full">
        <table className="w-full text-xs border-collapse table-fixed">
          <colgroup>
            {selectable && <col style={{ width: "36px" }} />}
            {columns.map((col, i) => (
              <col key={i} style={{ width: col.width ?? undefined }} />
            ))}
          </colgroup>

          {/* Head */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {selectable && (
                <th className="px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el)
                        el.indeterminate = somePageSelected && !allPageSelected;
                    }}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-[#1DA077] cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() =>
                    col.sortable &&
                    typeof col.accessor === "string" &&
                    handleSort(col.accessor as string)
                  }
                  className={`
                    px-3 py-3 font-semibold uppercase tracking-wider text-[10px] text-gray-400
                    ${alignClass(col.align)}
                    ${col.sortable ? "cursor-pointer select-none hover:text-gray-700 hover:bg-gray-100/60 transition-colors duration-150" : ""}
                  `}
                >
                  <div
                    className={`flex items-center gap-1 ${col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : ""}`}
                  >
                    <span className="truncate">{col.header}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-2.5 text-gray-400">
                    <svg
                      className="w-9 h-9 text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No data available
                    </p>
                    {search && (
                      <p className="text-xs text-gray-400">
                        Try adjusting your search
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const isSelected = selectable && selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id as string}
                    className={`
                      group transition-colors duration-100
                      ${isSelected ? "bg-[#1DA077]/[0.04] hover:bg-[#1DA077]/[0.07]" : "hover:bg-gray-50/60"}
                    `}
                  >
                    {selectable && (
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="w-3.5 h-3.5 rounded accent-[#1DA077] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-3 py-2.5 text-gray-600 align-middle overflow-hidden ${alignClass(col.align)}`}
                      >
                        {/* <div className="truncate">
                          {typeof col.accessor === "function"
                            ? col.accessor(
                                row,
                                (page - 1) * pageSize + rowIndex + 1,
                              )
                            : (row[col.accessor as keyof T] as React.ReactNode)}
                        </div> */}
                        <div className="truncate">
                          {typeof col.accessor === "function"
                            ? col.accessor(
                                row,
                                (page - 1) * pageSize + rowIndex + 1,
                              )
                            : (() => {
                                const val = row[col.accessor as keyof T];
                                if (
                                  val === null ||
                                  val === undefined ||
                                  val === ""
                                ) {
                                  return (
                                    <span className="text-gray-300 font-style: italic">N/A</span>
                                  );
                                }
                                return val as React.ReactNode;
                              })()}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────── */}
      {/* <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-600">
            {Math.min((page - 1) * pageSize + 1, sortedData.length)}–{Math.min(page * pageSize, sortedData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-600">{sortedData.length}</span>{" "}
          results
        </p>

        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                p = start + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150
                    ${page === p
                      ? "bg-[#1DA077] text-white shadow-sm shadow-[#1DA077]/25"
                      : "text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div> */}
      {/* ── Pagination ─────────────────────────────────────── */}
      {/* <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-600">
            {Math.min((page - 1) * pageSize + 1, sortedData.length)}–
            {Math.min(page * pageSize, sortedData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-600">
            {sortedData.length}
          </span>{" "}
          results
        </p>

        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="flex items-center gap-1 w-[196px] justify-center">
            {(() => {
              const pages: (number | "...")[] = [];

              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 4) pages.push("...");
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (page < totalPages - 3) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="w-7 h-7 flex items-center justify-center text-xs text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      page === p
                        ? "bg-[#1DA077] text-white shadow-sm shadow-[#1DA077]/25"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              );
            })()}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Next
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div> */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
        {/* Left: Summary */}
        <p className="text-xs text-gray-400">
          <span className="text-gray-700 font-semibold">
            {Math.min((page - 1) * pageSize + 1, sortedData.length)}–
            {Math.min(page * pageSize, sortedData.length)}
          </span>{" "}
          of {sortedData.length}
        </p>

        {/* Right: Controls */}
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers — 3 at a time */}
          {(() => {
            const pages: (number | "...")[] = [];

            if (totalPages <= 3) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              // Center the current page with one on each side
              let start = Math.max(1, page - 1);
              let end = start + 2;
              if (end > totalPages) {
                end = totalPages;
                start = end - 2;
              }
              if (start > 1) pages.push("...");
              for (let i = start; i <= end; i++) pages.push(i);
              if (end < totalPages) pages.push("...");
            }

            return pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="w-7 h-7 flex items-center justify-center text-xs text-gray-300 select-none"
                >
                  ···
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    page === p
                      ? "bg-[#1DA077] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ),
            );
          })()}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default CustomTable;
