const ProblemCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
      
      {/* Top Section */}
      <div className="flex justify-between items-start">
        
        {/* Left Content */}
        <div className="flex-1">
          
          {/* Title + Difficulty */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-7 bg-gray-300 rounded w-94" />
            <div className="h-6 w-16 bg-gray-300 rounded-full" />
          </div>

          {/* Topic */}
          <div className="h-5 bg-gray-200 rounded w-40" />
        </div>

        {/* Right Icons */}
        <div className="flex gap-6 ml-4">
          <div className="w-6 h-6 bg-gray-300 rounded" />
          <div className="w-6 h-6 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProblemCardSkeleton;