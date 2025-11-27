import { useEffect, useRef, useState } from "react";

export default function useLearningTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const secondsRef = useRef(0);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        secondsRef.current = prev + 1;
        return prev + 1;
      });
   
    }, 1000);
  };

  const stopTimer = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const minutes = Math.floor(secondsRef.current / 60);

    // Only track if at least 1 minute has passed
    if (minutes > 0) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ minutes }),
        });
        
        if (!response.ok) {
          console.error('Failed to track learning progress:', response.statusText);
        }
      } catch (error) {
        console.error('Error tracking learning progress:', error);
      }
    }

    secondsRef.current = 0;
    setSeconds(0);
  };

  useEffect(() => {
    const handleUnload = () => {
      stopTimer();
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      stopTimer();
    };
  }, []);

  return { startTimer, stopTimer, seconds };
}
