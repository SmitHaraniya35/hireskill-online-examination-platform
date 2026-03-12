import { useNavigate, useParams, useLocation } from "react-router-dom";
import Stepper from "../../../../components/shared/Stepper";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentDetailsSchema, type StudentDetailsInput } from '../../../../validators/studentDetails.validators'
import testFlowService from "../../../../services/testFlow.services";
import studentService from "../../../../services/student.services";

const StudentDetailsPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { studentId, testId, email } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPublicTest, setIsPublicTest] = useState(true);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StudentDetailsInput>({
    resolver: zodResolver(studentDetailsSchema),
    mode: "onTouched"
  });

  // Fetch student details if test is private (student exists)
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentId) {
        setIsPublicTest(true);
        return;
      }

      try {
        setLoading(true);
        setIsPublicTest(false);
        
        // You'll need to implement this service method
        const response = await studentService.getStudentById(studentId);
        console.log(response.payload);
        // Prefill the form with existing student data
        reset({
          name: response.payload!.student.name,
          phone: response.payload!.student.phone ,
          college: response.payload!.student.college,
          degree: response.payload!.student.degree,
          graduation_year: response.payload!.student.graduation_year,
          skills: response.payload!.student.skills,
          branch: response.payload!.student.branch
        });
      } catch (error: any) {
        setServerError(error.response?.data?.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId, reset]);

  const onFormSubmit = async (data: StudentDetailsInput) => {
    if (!studentId) {
      setServerError("Student ID not found");
      return;
    }

    setServerError('');
    try {
      await testFlowService.completeStudentDetails(data, studentId);
      
      // Navigate to test instructions page
      navigate(`/test/${slug}/instruction`);
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Failed to save student details");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#24a17e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center pt-10 pb-20 font-mono">
      <Stepper step={2} />
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-4xl border border-gray-100 mt-10">
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome, Complete Your Profile
        </h1>
        <p className="text-center text-gray-400 font-bold mb-10">
          {isPublicTest ? "Fill your details" : "Verify and update your details"}
        </p>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Section 1 */}
            <div className="col-span-12 md:col-span-7 space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Section 1: Personal Information
              </p>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  className={`w-full p-3 border rounded-lg mt-1 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    className={`w-full p-3 border rounded-lg mt-1 ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g. 9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("branch")}
                    className={`w-full p-3 border rounded-lg mt-1 ${
                      errors.branch ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g. Computer Science"
                  />
                  {errors.branch && (
                    <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Box */}
            <div className="col-span-12 md:col-span-5 flex flex-col pt-6">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-white transition-colors cursor-pointer">
                <div className="text-gray-300 text-3xl mb-2">📤</div>
                <p className="text-xs font-bold text-gray-600">
                  Resume Upload (Optional)
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {isPublicTest ? "No file uploaded" : "Current File: Student_Resume.pdf"}
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="col-span-12 space-y-4 mt-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Section 2: Educational Background
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    College <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("college")}
                    className={`w-full p-3 border rounded-lg ${
                      errors.college ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="College name"
                  />
                  {errors.college && (
                    <p className="text-red-500 text-xs mt-1">{errors.college.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("degree")}
                    className={`w-full p-3 border rounded-lg ${
                      errors.degree ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g. B.Tech"
                  />
                  {errors.degree && (
                    <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("graduation_year")}
                    className={`w-full p-3 border rounded-lg ${
                      errors.graduation_year ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g. 2026"
                  />
                  {errors.graduation_year && (
                    <p className="text-red-500 text-xs mt-1">{errors.graduation_year.message}</p>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                Please ensure details match your academic records.
              </p>
            </div>

            {/* Section 3 */}
            <div className="col-span-12 space-y-4 mt-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Section 3: Technical Skills
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Skills <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("skills")}
                    className={`w-full p-3 border rounded-lg ${
                      errors.skills ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="e.g. C++, Java, Python"
                  />
                  {errors.skills && (
                    <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {serverError && (
            <p className="text-red-500 text-sm mt-6 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#24a17e] text-white font-bold py-4 rounded-xl mt-10 hover:bg-[#1d8265] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentDetailsPage;