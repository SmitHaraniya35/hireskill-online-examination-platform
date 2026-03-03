import { useState } from "react";
import StudentService from "../../services/student.services";
import { useForm } from "react-hook-form";
import {
  type StudentFormInput,
  studentSchema,
} from "../../validators/CreateStudentManually";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const CreateStudentManually: React.FC = () => {
  const [serverError, setServerError] = useState("");

  //React hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      college: "",
    },
  });

  const onFormSubmit = async (data: StudentFormInput) => {
    setServerError("");
    const input = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      college: data.college,
    };
    try {
      await StudentService.createStudent(input);
      toast.success("Student created successfully");
      reset();
    } catch (err: any) {
      setServerError(err.message || "Invalid");
    }
  };
  return (
    <div className="bg-white shadow-xl rounded-2xl border-inherit p-8 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Student</h2>
        <p className="text-gray-500 text-sm mt-1">
          Add student details to generate access.
        </p>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="min-h-10">
          {serverError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm border border-red-200 flex items-center gap-2">
              ⚠️ {serverError}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Enter full name"
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.name ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 mt-1">
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter email"
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.email ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 mt-1">
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register("phone")}
            type="text"
            placeholder="Enter phone number"
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.phone ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 mt-1">
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            College
          </label>
          <input
            {...register("college")}
            type="text"
            placeholder="Enter college name"
            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:border-[#1DA077] outline-none transition ${
              errors.college ? "border-red-400" : "border-gray-200"
            }`}
          />
          <div className="h-5 mt-1">
            {errors.college && (
              <p className="text-red-500 text-xs">{errors.college.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1DA077] text-white py-3 rounded-2xl 
        font-semibold text-lg shadow-md 
        hover:bg-[#148562] hover:-translate-y-0.5 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
};
export default CreateStudentManually;
