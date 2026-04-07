import React, { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  z from "zod";
import { toast } from "react-toastify";
import studentService from "../../services/student.services";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";

// 1. Define the Validation Schema
const studentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// 2. Extract the Type from the Schema
type StudentFormData = z.infer<typeof studentSchema>;

interface CreateStudentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateStudent: React.FC<CreateStudentFormProps> = ({ onClose, onSuccess }) => {
  useLockBodyScroll();
  const [loading, setLoading] = useState(false);

  // 3. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setLoading(true);
    try {
      await studentService.createStudent( data.email);
      toast.success("Student registered successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error?: any) => `
    w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all focus:outline-none 
    ${error 
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/5" 
      : "border-gray-200 focus:border-[#1DA077] focus:ring-4 focus:ring-[#1DA077]/5"
    }
  `;

  const errorTextClass = "text-[10px] text-red-500 mt-1 ml-1 font-medium";

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-800">Add New Student</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={inputClass(errors.email)}
            />
          </div>
          {errors.email && <p className={errorTextClass}>{errors.email.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#1DA077] text-white text-sm font-medium rounded-xl shadow-md shadow-[#1DA077]/20 hover:bg-[#18906b] disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudent;