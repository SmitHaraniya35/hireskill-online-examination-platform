import { useNavigate } from "react-router-dom";

export default function NotFound404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
      
      <h1 className="text-[160px] md:text-[200px] font-extrabold text-[#020817] leading-none">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-[#020817] mt-4">
        Page Not Found!
      </h2>

      <p className="text-gray-600 mt-4 max-w-xl text-base md:text-lg">
        You've reached a dead end. Let's help you find a new path.
      </p>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mt-10 bg-[#020817] text-white px-10 py-4 text-lg font-medium 
                   hover:bg-black transition-all duration-300 
                   rounded-sm shadow-md hover:scale-[1.03] active:scale-95"
      >
        Back to Home
      </button>
    </div>
  );
}
