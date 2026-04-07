// import React, { useEffect, useState, useRef} from "react";

// interface ExamTimerProps {
//   expiresAt: string;
//   onTimeUp: () => void;
// }

// const ExamTimer: React.FC<ExamTimerProps> = ({
//   expiresAt,
//   onTimeUp,
// }) => {
//   const [timeLeft, setTimeLeft] = useState<number>(0);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const submittedRef = useRef(false);
//   const expiryTimeRef = useRef<number | null>(null);

//   // Parse expiresAt (runs every time prop changes)
//   useEffect(() => {
//     try {
//       const expiry = new Date(expiresAt).getTime();
//       if (!isNaN(expiry)) {
//         expiryTimeRef.current = expiry;
//       }
//     } catch (error) {
//       console.error("Invalid expiresAt:", expiresAt);
//     }
//   }, [expiresAt]); 

//   // Countdown timer (runs when expiryTime changes)
//   useEffect(() => {
//     if (!expiryTimeRef.current) return;

//     const updateTimer = () => {
//       const now = Date.now();
//       const remaining = Math.max(
//         Math.floor((expiryTimeRef.current! - now) / 1000),
//         0
//       );

//       setTimeLeft(remaining);

//       if (remaining <= 0 && !submittedRef.current) {
//         submittedRef.current = true;
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//         }
//         onTimeUp();
//       }
//     };

//     intervalRef.current = setInterval(updateTimer, 1000);
//     updateTimer(); 

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [onTimeUp, expiresAt]);

//   // Format time 
//   const formatTime = (seconds: number): string => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   //Visual states 
//   const isLowTime = timeLeft <= 300;
//   const isCritical = timeLeft <= 60;

//   return (
//     <div className={`p-2 rounded-lg border-2 shadow-md transition-all duration-300 ${
//       isCritical 
//         ? 'bg-red-50 border-red-400 animate-pulse' 
//         : isLowTime 
//         ? 'bg-orange-50 border-orange-400' 
//         : 'bg-gray-50 border-gray-200'
//     }`}>
//       <span className="font-semibold  text-2xl text-indigo-800 text-gray-700">Time left:</span>
//       <span 
//         className={` font-bold text-2xl ml-2 ${
//           isCritical 
//             ? 'text-red-600 animate-pulse' 
//             : isLowTime 
//             ? 'text-orange-600' 
//             : 'text-gray-900'
//         }`}
//       >
//         {formatTime(timeLeft)}
//       </span>
//     </div>
//   );
// };

// export default React.memo(ExamTimer);

import React, { useEffect, useState, useRef } from "react";

interface ExamTimerProps {
  expiresAt: string;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ expiresAt, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 1. Calculate the starting seconds ONCE
    const expiryTarget = new Date(expiresAt).getTime();
    const initialSeconds = Math.max(Math.floor((expiryTarget - Date.now()) / 1000), 0);
    
    setTimeLeft(initialSeconds);

    // 2. Start the manual reduction
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeUp(); // Calling the prop directly
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expiresAt, onTimeUp]); 

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft <= 300;
  const isCritical = timeLeft <= 60;

  return (
    <div className={`p-2 rounded-lg border-2 shadow-md transition-all duration-300 ${
      isCritical ? 'bg-red-50 border-red-400 animate-pulse' : 
      isLowTime ? 'bg-orange-50 border-orange-400' : 'bg-gray-50 border-gray-200'
    }`}>
      <span className="font-semibold text-2xl text-gray-700">Time left:</span>
      <span className={`font-bold text-2xl ml-2 ${
          isCritical ? 'text-red-600' : isLowTime ? 'text-orange-600' : 'text-gray-900'
      }`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default React.memo(ExamTimer);