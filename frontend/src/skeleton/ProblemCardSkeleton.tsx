const ProblemCardSkeleton = () => {
  return (
    <div className="grid grid-cols-[28px_1fr_64px] sm:grid-cols-[28px_1fr_100px_150px_100px] gap-x-3 items-center px-4 py-3 rounded-xl bg-[#fafafa] border border-[#eaecef] animate-pulse">

      {/* Index number */}
      <div className="h-3 w-5 bg-gray-200 rounded ml-auto" />

      {/* Title */}
      <div className="h-[13px] bg-gray-200 rounded w-2/5" />

      {/* Difficulty badge */}
      <div className="h-5 w-14 bg-gray-100 rounded-full" />

      {/* Topic pill — desktop only */}
      <div className="hidden sm:block h-5 w-24 bg-gray-100 rounded-md" />

      {/* Action icons — desktop only */}
      <div className="hidden sm:flex items-center gap-1.5 justify-end">
        <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
        <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
      </div>

    </div>
  );
};

export default ProblemCardSkeleton;