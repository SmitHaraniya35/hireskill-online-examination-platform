import { useEffect, useRef, useState } from "react";
import testLinkService from "../../services/testLinkService";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

interface GenerateProps {
  closeModal: () => void;
  refreshLinks: () => void;
  editData?: any;
  mode: "create" | "edit";
}

export const GenerateNewTest: React.FC<GenerateProps> = ({
  closeModal,
  refreshLinks,
  editData,
  mode,
}) => {
  const [title, setTitle] = useState("");
  const [selectDate, setSelectDate] = useState<Date | null>(null);
  const [expiryTime, setExpiryTime] = useState<string>("23:59");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit";

  useLockBodyScroll(true);

  // Initialize data for Edit Mode
  useEffect(() => {
    if (isEdit && editData) {
      const testObj = editData.test || editData || {};

      setTitle(testObj.title || "");
      setDuration(String(testObj.duration_minutes || ""));

      const exp = testObj.expiration_at;
      if (exp) {
        const parsed = new Date(exp);
        if (!isNaN(parsed.getTime())) {
          setSelectDate(parsed);
          const hh = String(parsed.getHours()).padStart(2, "0");
          const mm = String(parsed.getMinutes()).padStart(2, "0");
          setExpiryTime(`${hh}:${mm}`);
        }
      }
    } else {
      setTitle("");
      setSelectDate(null);
      setDuration("");
      setExpiryTime("23:59");
    }
  }, [editData, isEdit]);

  // Sync individual inputs with selectDate object
  useEffect(() => {
    if (selectDate) {
      setDay(String(selectDate.getDate()).padStart(2, "0"));
      setMonth(String(selectDate.getMonth() + 1).padStart(2, "0"));
      setYear(String(selectDate.getFullYear()));
    }
  }, [selectDate]);

  const updateSelectDateFromParts = (d: string, m: string, y: string) => {
    if (!d || !m || y.length < 4) {
      setSelectDate(null);
      return;
    }

    const dd = Number(d);
    const mm = Number(m);
    const yyyy = Number(y);
    const constructed = new Date(yyyy, mm - 1, dd);

    if (
      constructed.getFullYear() === yyyy &&
      constructed.getMonth() === mm - 1 &&
      constructed.getDate() === dd
    ) {
      setSelectDate(constructed);
    } else {
      setSelectDate(null);
    }
  };

  const handleDayChange = (val: string) => {
    const sanitized = val.replace(/[^0-9]/g, "").slice(0, 2);
    setDay(sanitized);
    if (sanitized.length === 2) monthRef.current?.focus();
    updateSelectDateFromParts(sanitized, month, year);
  };

  const handleMonthChange = (val: string) => {
    const sanitized = val.replace(/[^0-9]/g, "").slice(0, 2);
    setMonth(sanitized);
    if (sanitized.length === 2) yearRef.current?.focus();
    updateSelectDateFromParts(day, sanitized, year);
  };

  const handleYearChange = (val: string) => {
    const sanitized = val.replace(/[^0-9]/g, "").slice(0, 4);
    setYear(sanitized);
    updateSelectDateFromParts(day, month, sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !selectDate || !duration || !expiryTime) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    // --- TIMEZONE FIX LOGIC ---
    // Instead of toISOString() which converts to UTC, we build the string manually
    // to keep the "Wall Clock" time exactly as the user entered it.
    const [hh, mm] = expiryTime.split(":").map(Number);
    const yyyy = selectDate.getFullYear();
    const monthStr = String(selectDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(selectDate.getDate()).padStart(2, "0");
    const hourStr = String(hh).padStart(2, "0");
    const minStr = String(mm).padStart(2, "0");

    // Constructing local ISO format: YYYY-MM-DDTHH:mm:ss
    const formattedExpiration = `${yyyy}-${monthStr}-${dayStr}T${hourStr}:${minStr}:59`;

    const testData = {
      title: title.trim(),
      duration_minutes: Number(duration),
      expiration_at: formattedExpiration,
    };

    try {
      let res;
      const editId = editData?.test?.id || editData?.id;

      if (isEdit && editId) {
        res = await testLinkService.updateTestLink(editId, testData);
      } else {
        res = await testLinkService.createTestLink(testData);
      }

      if (res?.success) {
        refreshLinks();
        closeModal();
      } else {
        alert(res?.message || "Invalid input");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isEdit ? "Update test" : "Generate new test"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Set requirements for the assessment link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            placeholder="Enter role / exam name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none transition"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Select Date</label>
          <div className="flex items-center gap-2">
            <input 
              ref={dayRef} 
              placeholder="DD" 
              value={day} 
              onChange={(e) => handleDayChange(e.target.value)} 
              className="w-[72px] text-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none" 
            />
            <span className="text-gray-500 font-bold">/</span>
            <input 
              ref={monthRef} 
              placeholder="MM" 
              value={month} 
              onChange={(e) => handleMonthChange(e.target.value)} 
              className="w-[72px] text-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none" 
            />
            <span className="text-gray-500 font-bold">/</span>
            <input 
              ref={yearRef} 
              placeholder="YYYY" 
              value={year} 
              onChange={(e) => handleYearChange(e.target.value)} 
              className="w-[104px] text-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none transition"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Expiry Time</label>
          <input
            type="time"
            value={expiryTime}
            onChange={(e) => setExpiryTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/10 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1DA077] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#148562] hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update test" : "Create test"}
        </button>
      </form>
    </div>
  );
};

export default GenerateNewTest;