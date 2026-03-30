import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import StudentService from "../../services/student.services";
import type { StudentInfo } from "../../types/student.types";
import { ArrowLeft, X, Check } from "lucide-react";
import { toast } from "react-toastify";

const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <input
      type="text"
      readOnly
      value={value || "Not provided"}
      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-2.5 px-4 focus:outline-none cursor-default"
    />
  </div>
);

const EditableField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof StudentInfo;
  value: string | number | undefined | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={label}
      className="w-full bg-white border border-[#1DA077]/40 text-gray-800 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#1DA077]/30 focus:border-[#1DA077] transition-all duration-150"
    />
  </div>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isEditMode = searchParams.get("mode") === "edit";

  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [formData, setFormData] = useState<StudentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await StudentService.getStudentById(id!);
        const data = response.payload!.student;
        
        // Filter out any fields that might cause validation errors
        const cleanData = {
          name: data.name,
          email: data.email,
          phone: String(data.phone),
          college: data.college,
          degree: data.degree,
          graduation_year: data.graduation_year,
          skills: data.skills,
          branch: data.branch,
        };
        
        setStudent(cleanData);
        setFormData({ ...cleanData });
      } catch (err: any) {
        setIsError(true);
        setErrorMsg(err.response?.data?.message || "Failed to fetch student");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      // Only send allowed fields to the API
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        degree: formData.degree,
        graduation_year: formData.graduation_year,
        skills: formData.skills,
        branch: formData.branch,
      };
      
      await StudentService.updateStudent(id!, updateData);
      toast.success("Student updated successfully");
      setStudent({ ...formData });
      setSearchParams({});
      navigate("/admin/student-management");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (student) setFormData({ ...student });
    setSearchParams({});
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!student || !formData) return null;

  const displayName = isEditMode ? formData.name : student.name;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-12">
      {/* Top Nav */}
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </button>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isEditMode
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
          }`}
        >
          {isEditMode ? "Edit Mode" : "View Mode"}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* ── Profile Header Card ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#4a6b8c] font-bold text-xl flex-shrink-0 shadow-sm border border-blue-50">
              {initials}
            </div>

            {/* Name / Email / Phone */}
            <div className="flex-1 min-w-0">
              {isEditMode ? (
                /* Edit mode — inline inputs right inside the header card */
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="text-xl font-extrabold text-gray-900 tracking-tight bg-white border border-[#1DA077]/40 rounded-xl py-1.5 px-3 w-full focus:outline-none focus:ring-2 focus:ring-[#1DA077]/30 focus:border-[#1DA077] transition-all duration-150"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                      <svg
                        width="14"
                        height="14"
                        className="text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="text-sm text-gray-600 bg-white border border-[#1DA077]/40 rounded-lg py-1 px-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#1DA077]/30 focus:border-[#1DA077] transition-all duration-150"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                      <svg
                        width="14"
                        height="14"
                        className="text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="text-sm text-gray-600 bg-white border border-[#1DA077]/40 rounded-lg py-1 px-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#1DA077]/30 focus:border-[#1DA077] transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* View mode — plain text */
                <>
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {student.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {student.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      {student.phone}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action buttons - Only show in edit mode */}
          {isEditMode && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleCancel}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-150"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#1DA077] hover:bg-[#179268] border border-[#1DA077] transition-all duration-150 disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Academic */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#1DA077] rounded-full"></span>
                Academic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {isEditMode ? (
                  <>
                    <EditableField label="College / University" name="college" value={formData.college} onChange={handleChange} />
                    <EditableField label="Degree Program" name="degree" value={formData.degree} onChange={handleChange} />
                    <EditableField label="Field of Study" name="branch" value={formData.branch} onChange={handleChange} />
                    <EditableField label="Graduation Year" name="graduation_year" value={formData.graduation_year} onChange={handleChange} />
                  </>
                ) : (
                  <>
                    <ReadOnlyField label="College / University" value={student.college} />
                    <ReadOnlyField label="Degree Program" value={student.degree} />
                    <ReadOnlyField label="Field of Study" value={student.branch} />
                    <ReadOnlyField label="Graduation Year" value={student.graduation_year} />
                  </>
                )}
              </div>
            </section>
          </div>

          {/* Right: Skills */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#1DA077] rounded-full"></span>
                Technical Skills
              </h2>

              {isEditMode ? (
                <div className="flex flex-col gap-3">
                  <EditableField
                    label="Skills (comma-separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                  {formData.skills && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.split(",").map((s) =>
                        s.trim() ? (
                          <span
                            key={s}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium rounded-xl text-xs"
                          >
                            {s.trim()}
                          </span>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {student.skills ? (
                    student.skills.split(",").map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium rounded-xl text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No skills added yet.
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;