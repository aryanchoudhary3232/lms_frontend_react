import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/student/Quiz.css";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";

const Quiz = () => {
  const { courseId, chapterId, topicId } = useParams();

  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [answerQuiz, setAnswerQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { startTimer, stopTimer, seconds } = useLearningTimer();

  useEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await fetch(
          `${backendUrl}/student/courses/${courseId}`
        );
        const courseResponse = await response.json();

        if (response.ok && courseResponse.success) {
          const chapter = courseResponse.data.chapters.find(
            (chapter) => chapter._id === chapterId
          );
          const topic = chapter.topics.find((topic) => topic._id === topicId);
          setQuiz(topic.quiz);

          setQuizTitle(courseResponse.data.title);
        } else {
          console.error(
            "Error fetching course for quiz:",
            courseResponse.message
          );
        }
      } catch (error) {
        console.log("err occurred..", error);
      }
    }

    getCourseById();
  }, [courseId, chapterId, topicId]);

  console.log(quiz);

  const handleTickOption = (questionIdx, option) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIdx] = option;
      return newAnswers;
    });
    setAnswerQuiz((prev) => {
      const updated = prev.filter(
        (ans) => ans.question !== quiz[questionIdx].question
      );
      return [
        ...updated,
        { question: quiz[questionIdx].question, tickOption: option },
      ];
    });
  };

  console.log("answerQuiz", answerQuiz);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      courseId,
      chapterId,
      topicId,
      answerQuiz,
    };
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/student/quiz_submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      }
    );

    const data = await response.json();
    console.log("data", data.data);

    if (response.ok) {
      setResult(data.data);
      setIsSubmitted(true);
    }
  };
  console.log("result", result);

  return !isSubmitted ? (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "22px" }}
    >
      <h1>{seconds}</h1>
      <h2 style={{ textAlign: "center" }}>Topic: {quizTitle}</h2>
      <form
        onSubmit={handleOnSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 12px rgba(0,0,0,0.2)",
          borderRadius: "5px",
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "12px 12px 0px 12px",
        }}
      >
        {quiz.map((question, questionIdx) => (
          <div key={questionIdx} style={{ marginBottom: "15px" }}>
            <div style={{ fontWeight: "600", marginBottom: "10px" }}>
              Q{questionIdx + 1}:&nbsp;{question.question}
            </div>
            <div
              className=""
              style={{
                display: "flex",
                gap: "12px",
                flexDirection: "column",
              }}
            >
              {question.options.map((option, optionIdx) => (
                <div
                  key={optionIdx}
                  className=""
                  style={{ display: "flex", gap: "6px" }}
                >
                  <input
                    onChange={() => handleTickOption(questionIdx, option)}
                    checked={userAnswers[questionIdx] === option}
                    name={`question-${questionIdx}`}
                    type="radio"
                  />
                  <div>{option}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: "955px",
            marginLeft: "auto",
            marginRight: "auto",
            background: "#2337ad",
            color: "white",
            border: "none",
            marginTop: "18px",
            padding: "12px 0px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Finish Quiz
        </button>
      </form>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 0 6px rgba(0,0,0,0.2)",
        width: "50vw",
        margin: "44px auto",
        borderRadius: "6px",
      }}
    >
      <h2>🎉 Quiz Result</h2>
      <div
        style={{
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          background: "rgb(230 232 241)",
          width: "80%",
          textAlign: "center",
          padding: "14px 0px",
          fontWeight: 600,
          borderRadius: "5px",
          marginBottom: "17px",
          fontSize: "21px",
        }}
      >
        Your Score:{" "}
        <span style={{ color: "green" }}>
          {" "}
          {result.score} ({result.correct}/{result.totalQuestions}) correct
        </span>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {result?.quiz?.map((q, qidx) => (
          <div
            key={qidx}
            className={q.tickOption === q.correctOption ? "green" : ""}
            style={{
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              padding: "4px 5px",
              width: "79%",
              marginBottom: "11px",
              borderRadius: "5px",
            }}
          >
            <div style={{ marginBottom: "13px" }}>
              {q.tickOption === q.correctOption ? "✅" : "❌"}{" "}
              <span style={{ marginLeft: "12px", fontWeight: 600 }}>
                Q{qidx + 1}.{q.questionText}
              </span>
            </div>
            <div
              className=""
              style={{
                marginBottom: "9px",
                marginLeft: "33px",
              }}
            >
              <span style={{ fontWeight: "600" }}>Your Answer: </span>
              {q.tickOption}
            </div>
            <div
              className=""
              style={{ marginBottom: "9px", marginLeft: "33px" }}
            >
              <span style={{ fontWeight: "600" }}>Correct Answer:</span>{" "}
              {q.correctOption}
            </div>
            <div
              className=""
              style={{ marginBottom: "9px", marginLeft: "33px" }}
            >
              <span style={{ fontWeight: "600" }}>Explanation:</span>{" "}
              {q.explaination}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
