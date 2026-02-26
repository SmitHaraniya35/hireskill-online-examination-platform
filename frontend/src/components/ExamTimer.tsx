import React, { useEffect, useState, useRef } from "react";
import StudentAttemptService from "../services/studentAttempt.services";

interface ExamTimerProps {
  studentAttemptId: string;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  studentAttemptId,
  onTimeUp,
}) => {
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  // STEP 1: Fetch expiry from backend
  useEffect(() => {
    if (!studentAttemptId) return;

    const fetchAttempt = async () => {
      try {
        const res = await StudentAttemptService.getStudentAttempt(studentAttemptId);
        console.log("Attempt API response:", res); 

        const expiresAt = res.payload?.studentAttempt?.expires_at;

        if (!expiresAt) {
          console.error("expires_at missing");
          return;
        }

        const expiry = new Date(expiresAt).getTime();
        setExpiryTime(expiry);

      } catch (error) {
        console.error("Timer fetch error:", error);
      }
    };

    fetchAttempt();
  }, [studentAttemptId]);

  // STEP 2: Start countdown only when expiryTime exists
  useEffect(() => {
    if (!expiryTime) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(
        Math.floor((expiryTime - now) / 1000),
        0
      );

      setTimeLeft(remaining);

      if (remaining <= 0 && !submittedRef.current) {
        submittedRef.current = true;
        clearInterval(intervalRef.current!);
        console.log("before on time:")
        onTimeUp();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [expiryTime]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-3 rounded-md bg-gray-100">
      <span className="font-semibold font-mono text-2xl">Timer: </span>
      <span className="font-mono text-red-500 text-2xl">
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

export default ExamTimer;