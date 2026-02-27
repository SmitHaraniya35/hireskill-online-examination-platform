import React, { useMemo, useState } from "react";

interface Column<T> {
  header: string;
  // If accessor is a string, it will be used for sorting.
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

function CustomTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
}: CustomTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Helper to search deeply into nested objects (student.name, etc.)
  const deepSearch = (obj: any, target: string): boolean => {
    if (!obj) return false;
    return Object.values(obj).some((val) => {
      if (typeof val === "object") return deepSearch(val, target);
      return String(val).toLowerCase().includes(target.toLowerCase());
    });
  };

  // 1. Filtering Logic
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) => deepSearch(row, search));
  }, [data, search]);

  // 2. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b bg-white">
        <input
          type="text"
          placeholder="Search by name, email, or problem..."
          className="w-full max-w-sm px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1DA077] outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-4 border-b ${col.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={() =>
                    col.sortable && typeof col.accessor === "string" && handleSort(col.accessor)
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.accessor && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, index) => (
                  <td key={index} className="p-4 text-gray-700">
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <span className="text-gray-600">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomTable;