const StudentAttemptListSkeleton = () => {
  return (
    <div className="grid grid-cols-9 gap-4 items-center p-3 border-t animate-pulse">
      
      {/* Name */}
      <div className="h-4 bg-gray-300 rounded w-24" />

      {/* Email */}
      <div className="h-4 bg-gray-200 rounded w-32" />

      {/* Phone */}
      <div className="h-4 bg-gray-200 rounded w-24" />

      {/* Problem */}
      <div className="h-4 bg-gray-300 rounded w-28" />

      {/* Difficulty */}
      <div className="h-4 bg-gray-200 rounded w-16" />

      {/* Started */}
      <div className="h-4 bg-gray-200 rounded w-32" />

      {/* Expires */}
      <div className="h-4 bg-gray-200 rounded w-32" />

      {/* Status */}
      <div className="h-6 bg-gray-300 rounded w-16" />

      {/* Submitted */}
      <div className="h-6 bg-gray-300 rounded w-20" />
      
    </div>
  );
};

export default StudentAttemptListSkeleton;