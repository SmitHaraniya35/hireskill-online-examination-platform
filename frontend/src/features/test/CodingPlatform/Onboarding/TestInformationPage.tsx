import Stepper from "../../../../components/shared/Stepper";

const TestInformationPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center pt-10 font-mono">
      <Stepper step={3} />
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-2xl mt-10 border border-gray-100">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">
          Step 3: Test Access
        </h1>
        <p className="text-gray-500 font-bold mb-8">Test Instructions</p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">
            Assessment: Software Engineer
          </h2>
          <div className="grid grid-cols-3 gap-0 bg-[#f8f9fa] rounded-xl overflow-hidden border border-gray-100">
            <div className="p-4 border-r border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Total Problems
              </p>
              <p className="text-lg font-bold">2</p>
            </div>
            <div className="p-4 border-r border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Total Time
              </p>
              <p className="text-lg font-bold">120 Minutes</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Remaining Time
              </p>
              <p className="text-lg font-bold text-gray-400">[Not Started]</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="font-bold text-gray-800">Key and Instructions:</p>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-gray-600">
              <span className="text-[#24a17e]">•</span>
              <span>
                Environment Check: Complete system test before starting.
              </span>
            </li>
            <li className="flex gap-2 text-sm text-gray-600">
              <span className="text-[#24a17e]">•</span>
              <span>Integrity: Plagiarism is strictly prohibited.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 mb-10">
          <p className="font-bold text-gray-800">Readiness Checklist:</p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <input
              type="checkbox"
              checked
              readOnly
              className="accent-[#24a17e]"
            />
            <span>
              Read rules -{" "}
              <span className="text-emerald-600 font-bold">Ready</span>
            </span>
          </div>
        </div>

        <button className="w-full bg-[#24a17e] text-white font-bold py-4 rounded-xl hover:bg-[#1d8265] shadow-lg shadow-emerald-50">
          Begin Test
        </button>
      </div>
    </div>
  );
};
export default TestInformationPage;
