const StudentAttemptListSkeleton = () => {
  return (
    <div className="grid grid-cols-[4%_12%_12%_9%_8%_8%_9%_10%_10%_8%_7%] gap-x-3 items-center px-4 py-3 rounded-xl bg-white border border-gray-100 animate-pulse">

      {/* # — small circle */}
      <div className="w-5 h-5 rounded-full bg-gray-100 mx-auto" />

      {/* Name */}
      <div className="h-3.5 bg-gray-200 rounded w-4/5" />

      {/* Email */}
      <div className="h-3 bg-gray-100 rounded w-full" />

      {/* Phone */}
      <div className="h-3 bg-gray-100 rounded w-3/4" />

      {/* Started — two-line date cell */}
      <div className="flex flex-col gap-1">
        <div className="h-3 bg-gray-200 rounded w-14" />
        <div className="h-2.5 bg-gray-100 rounded w-10" />
      </div>

      {/* Expiry — two-line date cell */}
      <div className="flex flex-col gap-1">
        <div className="h-3 bg-gray-200 rounded w-14" />
        <div className="h-2.5 bg-gray-100 rounded w-10" />
      </div>

      {/* Finished — two-line date cell */}
      <div className="flex flex-col gap-1">
        <div className="h-3 bg-gray-200 rounded w-14" />
        <div className="h-2.5 bg-gray-100 rounded w-10" />
      </div>

      {/* Status — pill */}
      <div className="h-5 w-20 bg-gray-100 rounded-full" />

      {/* Result — two-line center */}
      <div className="flex flex-col items-center gap-1">
        <div className="h-3.5 bg-gray-200 rounded w-10" />
        <div className="h-2.5 bg-gray-100 rounded w-8" />
      </div>

      {/* Time Taken */}
      <div className="h-3 bg-gray-100 rounded w-10 mx-auto" />

      {/* Actions — two icon buttons */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
        <div className="w-7 h-7 rounded-[7px] bg-gray-100 border border-gray-100" />
      </div>

    </div>
  );
};

export default StudentAttemptListSkeleton;