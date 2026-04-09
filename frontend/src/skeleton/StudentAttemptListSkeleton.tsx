const StudentAttemptListSkeleton = () => {
  return (
    <div className="grid grid-cols-11 gap-x-2 items-center px-4 py-3 rounded-xl bg-white border border-gray-100 animate-pulse min-w-0">

      {/* # — small circle */}
      <div className="w-5 h-5 rounded-full bg-gray-100 mx-auto" />

      {/* Name */}
      <div className="h-3.5 bg-gray-200 rounded w-4/5 min-w-0" />

      {/* Email */}
      <div className="h-3 bg-gray-100 rounded w-full min-w-0" />

      {/* Phone */}
      <div className="h-3 bg-gray-100 rounded w-3/4 min-w-0" />

      {/* Started — two-line date cell */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-4/5" />
      </div>

      {/* Expiry — two-line date cell */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-4/5" />
      </div>

      {/* Finished — two-line date cell */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-4/5" />
      </div>

      {/* Status — pill */}
      <div className="h-5 w-full max-w-[90px] bg-gray-100 rounded-full" />

      {/* Result — two-line center */}
      <div className="flex flex-col items-center gap-1 min-w-0">
        <div className="h-3.5 bg-gray-200 rounded w-10" />
        <div className="h-2.5 bg-gray-100 rounded w-8" />
      </div>

      {/* Time Taken */}
      <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto" />

      {/* Actions — two icon buttons */}
      <div className="flex items-center justify-center gap-1.5 min-w-0">
        <div className="w-9 h-5 rounded-[7px] bg-gray-100 border border-gray-100 shrink-0" />
        <div className="w-9 h-5 rounded-[7px] bg-gray-100 border border-gray-100 shrink-0" />
      </div>

    </div>
  );
};

export default StudentAttemptListSkeleton;