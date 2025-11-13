import { useEffect, useRef, useState } from "react";

export default function useLearningTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const secondsRef = useRef(0);

  const startTimer = () => {
    console.log("timer started");
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        secondsRef.current = prev + 1;
        return prev + 1;
      });
      console.log("seconds", seconds);
      console.log("secondsRef", secondsRef.current);
    }, 1000);
  };

  const stopTimer = async () => {
    console.log("timer stopped");
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    console.log("seconds inside useLearning hook", seconds);
    const minutes = Math.floor(secondsRef.current / 60);
    console.log("minutes", minutes);

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ minutes }),
    });

    // setSeconds(0);
  };
  console.log("seconds", seconds);
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
