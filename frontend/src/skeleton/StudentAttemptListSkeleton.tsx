
const StudentAttemptListSkeleton = () => {
  return (
    <div className="grid grid-cols-9 bg-white rounded-2xl shadow p-5 justify-between items-center animate-pulse">
      
      {/* Left content */}
      <div className="flex-1">
        <div className="h-5.5 bg-gray-300 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>

      {/* Right icons */}
      <div className="flex gap-4 ml-4">
        <div className="w-5 h-5 bg-gray-300 rounded" />
        <div className="w-5 h-5 bg-gray-300 rounded" />
        <div className="w-5 h-5 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default StudentAttemptListSkeleton;