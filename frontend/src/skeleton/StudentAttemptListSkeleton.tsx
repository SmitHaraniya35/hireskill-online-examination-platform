const StudentAttemptListSkeleton = () => {
  return (
    <div className="w-full">
        <div 
          className="grid grid-cols-10 gap-4 items-center justify-between p-4 border-b border-gray-200 animate-pulse bg-white"
        >
          {/* Name */}
          <div className="col-span-1">
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <div className="h-3 bg-gray-200 rounded w-18" />
          </div>

          {/* Problem - More space */}
          <div className="col-span-2">
            <div className="h-4 bg-gray-300 rounded w-42" />
          </div>

          {/* Difficulty */}
          <div className="col-span-1">
            <div className="h-3 bg-gray-200 rounded w-14" />
          </div>

          {/* Started */}
          <div className="col-span-1">
            <div className="flex flex-col gap-1">
              <div className="h-3 bg-gray-200 rounded w-12" />
              <div className="h-3 bg-gray-200 rounded w-14" />
            </div>
          </div>

          {/* Expires */}
          <div className="col-span-1">
            <div className="flex flex-col gap-1">
              <div className="h-3 bg-gray-200 rounded w-12" />
              <div className="h-3 bg-gray-200 rounded w-14" />
            </div>
          </div>

          {/* Status */}
          <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded w-14" />
          </div>

          {/* Submitted Badge */}
          <div className="col-span-1">
            <div className="h-7 bg-green-100 rounded-md w-16 border border-green-200" />
          </div>
        </div>
    </div>
  );
};

export default StudentAttemptListSkeleton;