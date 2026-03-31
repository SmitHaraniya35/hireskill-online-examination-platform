const TestCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 animate-pulse">

      {/* LEFT: Title + meta */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="h-[22px] bg-gray-200 rounded-md w-3/5 mb-3" />

        {/* Date + dot + duration */}
        <div className="flex items-center gap-4">
          <div className="h-3.5 bg-gray-100 rounded w-24" />
          <div className="w-1 h-1 rounded-full bg-gray-200" />
          <div className="h-3.5 bg-gray-100 rounded w-16" />
        </div>
      </div>

      {/* RIGHT: action icons + toggle pills */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">

        {/* Row 1 — 3 icon buttons */}
        <div className="flex items-center gap-0.5">
          <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
          <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
          <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
          <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
        </div>

        {/* Row 2 — 2 toggle pills */}
        <div className="flex items-center gap-2">
          <div className="h-[26px] w-[68px] rounded-lg bg-gray-100" />
          <div className="h-[26px] w-[68px] rounded-lg bg-gray-100" />
        </div>
      </div>

    </div>
  );
};

export default TestCardSkeleton;