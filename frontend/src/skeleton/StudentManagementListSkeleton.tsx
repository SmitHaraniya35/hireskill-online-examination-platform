const StudentManagementListSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-4 items-center justify-center p-4 border-b border-gray-200 animate-pulse bg-white">
        {/* Name */}
        <div className="col-span-1 justify-center">
          <div className="h-4 bg-gray-300 rounded w-30" />
        </div>

        {/* Email */}
        <div className="col-span-1 justify-center">
          <div className="h-4 bg-gray-200 rounded w-30" />
        </div>

        {/* Phone */}
        <div className="col-span-1 justify-center">
          <div className="h-4 bg-gray-200 rounded w-25" />
        </div>

        {/* College */}
        <div className="col-span-2 justify-center">
          <div className="h-4 bg-gray-300 rounded w-55" />
        </div>
      </div>
    </div>
  );
};

export default StudentManagementListSkeleton;
