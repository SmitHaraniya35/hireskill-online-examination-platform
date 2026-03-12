// Shared Stepper Component
const Stepper = ({ step }: any) => (
  <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-10">
    {[
      { label: "Email Verified", icon: "✓" },
      { label: "Basic Details", icon: "👤" },
      { label: "Test Instructions", icon: "🌐" }
    ].map((item, i) => (
      <div key={i} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
            i + 1 <= step ? 'bg-[#24a17e] border-[#24a17e] text-white' : 'bg-white border-gray-200 text-gray-300'
          }`}>
            {i + 1 < step ? "✓" : (i === 1 ? "👤" : (i === 2 ? "🌐" : "1"))}
          </div>
          <span className="absolute -bottom-6 text-[10px] font-semibold whitespace-nowrap text-gray-500 uppercase tracking-tighter">
            {item.label}
          </span>
        </div>
        {i < 2 && (
          <div className={`h-0.5 w-full mx-2 ${i + 1 < step ? 'bg-[#24a17e]' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

export default Stepper;