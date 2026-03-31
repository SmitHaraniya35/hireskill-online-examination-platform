import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import testFlowService from "../services/testFlow.services";

const StudentProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { studentAttemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await testFlowService.validateStudentAttemptById(
          studentAttemptId!
        );

        const attempt = res.payload;
        
        if (!attempt!.is_active) {
          navigate("/student-attempt-expired");
          return;
        }

        if (attempt!.is_submitted) {
          navigate("/test-submitted");
          return;
        }
        setIsAllowed(true);
      } catch (err) {
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [studentAttemptId, navigate]);

  if (loading) {
    return <div className="text-center mt-10">Checking access...</div>;
  }

  return isAllowed ? <>{children}</> : null;
};

export default StudentProtectedRoute;