import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import testLinkService from "../../../services/test.services";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import type { Test } from "../../../types/test.types";
import { testSchema, type TestFormInput } from '../../../validators/GenerateNewTest.validators'
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestFormInput>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: "",
      duration: "",
      expiry_time: "23:59",
      day: "",
      month: "",
      year: "",
    },
  });

  const day = watch("day");
  const month = watch("month");
  const year = watch("year");

  useLockBodyScroll(true);

  // Initialize data for Edit Mode
  useEffect(() => {
    if (isEdit && editData) {
      const testObj: Test = editData;

      setValue("title", testObj.title);
      setValue("duration", String(testObj.duration_minutes));

      const exp = testObj.expiration_at;
      if (exp) {
        const parsed = new Date(exp);
        if (!isNaN(parsed.getTime())) {
          setValue("day", String(parsed.getDate()).padStart(2, "0"));
          setValue("month", String(parsed.getMonth() + 1).padStart(2, "0"));
          setValue("year", String(parsed.getFullYear()));
          
          const hh = String(parsed.getHours()).padStart(2, "0");
          const mm = String(parsed.getMinutes()).padStart(2, "0");
          setValue("expiry_time", `${hh}:${mm}`);
        }
      }
    }
  }, [editData, isEdit, setValue]);

  const onSubmit = async (data: TestFormInput) => {
    setLoading(true);
    setIsError(false);
    setErrorMsg("");

    // --- TIMEZONE FIX LOGIC ---
    const [hh, mm] = data.expiry_time.split(":").map(Number);
    const yyyy = Number(data.year);
    const monthNum = Number(data.month);
    const dayNum = Number(data.day);
    
    const monthStr = String(monthNum).padStart(2, "0");
    const dayStr = String(dayNum).padStart(2, "0");
    const hourStr = String(hh).padStart(2, "0");
    const minStr = String(mm).padStart(2, "0");

    const formattedExpiration = `${yyyy}-${monthStr}-${dayStr}T${hourStr}:${minStr}:59`;

    const testData = {
      title: data.title.trim(),
      duration_minutes: Number(data.duration),
      expiration_at: formattedExpiration,
    };

    try {
      const testId = editData?.id;

      if (isEdit && testId) {
        await testLinkService.updateTest(testId, testData);
        toast.success("Test Updated Successfully!")
      } else {
        await testLinkService.createTest(testData);
        toast.success("Test Created Successfully!")
      }
      refreshLinks();
      closeModal();
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-5">
      <div className="mb-4"> {/* Reduced margin from 8 to 4 */}
        <h2 className="text-2xl font-semibold text-gray-900">
          {isEdit ? "Update test" : "Generate new test"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Set requirements for the assessment link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {/* Fixed height for top-level server errors */}
        <div className="min-h-[32px] mb-2">
          {isError && errorMsg && (
            <div className="bg-red-50 text-red-500 p-2 rounded-lg text-xs border border-red-100 flex items-center gap-2">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Title Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter role / exam name"
            {...register("title")}
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.title ? "border-red-400" : "border-gray-200"
            }`}
          />
          {/* Reserved Space for Error */}
          <div className="h-5 flex items-center">
            {errors.title && (
              <p className="text-red-500 text-[11px] ml-1">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Date Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Select Date</label>
          <div className="flex items-center gap-2">
            <input
              {...register("day")}
              placeholder="DD"
              maxLength={2}
              className={`w-18 text-center px-3 py-2 border rounded-lg bg-gray-50 outline-none ${
                errors.day ? "border-red-400" : "border-gray-200"
              }`}
            />
            <span className="text-gray-500 font-bold">/</span>
            <input
              {...register("month")}
              placeholder="MM"
              maxLength={2}
              className={`w-18 text-center px-3 py-2 border rounded-lg bg-gray-50 outline-none ${
                errors.month ? "border-red-400" : "border-gray-200"
              }`}
            />
            <span className="text-gray-500 font-bold">/</span>
            <input
              {...register("year")}
              placeholder="YYYY"
              maxLength={4}
              className={`w-26 text-center px-3 py-2 border rounded-lg bg-gray-50 outline-none ${
                errors.year ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          <div className="h-5 flex items-center">
            {(errors.day || errors.month || errors.year) && (
              <p className="text-red-500 text-[11px] ml-1">Valid date is required</p>
            )}
          </div>
        </div>

        {/* Duration Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Duration (minutes)</label>
          <input
            placeholder="Enter duration"
            {...register("duration")}
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.duration ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 flex items-center">
            {errors.duration && (
              <p className="text-red-500 text-[11px] ml-1">{errors.duration.message}</p>
            )}
          </div>
        </div>

        {/* Expiry Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Expiry Time</label>
          <input
            type="time"
            {...register("expiry_time")}
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none ${
              errors.expiry_time ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 flex items-center">
            {errors.expiry_time && (
              <p className="text-red-500 text-[11px] ml-1">{errors.expiry_time.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1DA077] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#148562] hover:-translate-y-0.5 transition disabled:opacity-50 mt-2"
        >
          {loading ? "Processing..." : isEdit ? "Update test" : "Create test"}
        </button>
      </form>
    </div>
  );
};

export default GenerateNewTest;