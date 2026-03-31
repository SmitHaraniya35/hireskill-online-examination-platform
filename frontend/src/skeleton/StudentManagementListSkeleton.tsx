const StudentManagementListSkeleton = () => {
  return (
    <div className="grid grid-cols-[14%_14%_1fr_10%_7%_10%_1fr_80px] gap-x-3 items-center px-4 py-3 rounded-xl bg-white border border-gray-100 animate-pulse">

      {/* Name */}
      <div className="h-3.5 bg-gray-200 rounded w-4/5" />

      {/* Email */}
      <div className="h-3 bg-gray-100 rounded w-full" />

      {/* Phone */}
      <div className="h-3 bg-gray-100 rounded w-3/4" />

      {/* College */}
      <div className="h-3 bg-gray-200 rounded w-4/5" />

      {/* Branch */}
      <div className="h-3 bg-gray-100 rounded w-full" />

      {/* Degree */}
      <div className="h-3 bg-gray-100 rounded w-3/4" />

      {/* Graduation Year */}
      <div className="h-3 bg-gray-100 rounded w-12" />

      {/* Actions — two icon buttons */}
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-100 flex-shrink-0" />
        <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-100 flex-shrink-0" />
      </div>

    </div>
  );
};

export default StudentManagementListSkeleton;