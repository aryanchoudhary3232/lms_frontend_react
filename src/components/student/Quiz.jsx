import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Quiz = () => {
  let { courseId, chapterIdx, topicIdx } = useParams();
  chapterIdx = Number(chapterIdx);
  topicIdx = Number(topicIdx);

  const [quiz, setQuiz] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    async function getCourseById() {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/teacher/courses/get_course_by_id/${courseId}`
        );
        const courseResponse = await response.json();

        const quizData =
          courseResponse.data.chapters[chapterIdx].topics[topicIdx].quiz;

        setQuizTitle(courseResponse.data.title);

        if (response.ok) {
          setQuiz(quizData);
        }
      } catch (error) {
        console.log("err occured..", error);
      }
    }

    getCourseById();
  }, [courseId, chapterIdx, topicIdx]);

  console.log(quiz);

  const handleTickOption = (e, option) => {
    setUserAnswers((prev) => [...prev, option]);
  };
  console.log("userAnswers", userAnswers);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "22px" }}
    >
      <h2 style={{ textAlign: "center" }}>Topic: {quizTitle}</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 12px rgba(0,0,0,0.2)",
          borderRadius: '5px',
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "12px 12px 0px 12px",
        }}
      >
        {quiz.map((question, questionIdx) => (
          <div key={questionIdx} style={{marginBottom: '15px'}}>
            <div style={{ fontWeight: "600", marginBottom: "10px" }}>
              Q{questionIdx + 1}:&nbsp;{question.question}
            </div>
            <div
              className=""
              style={{ display: "flex", gap: "12px", flexDirection: "column" }}
            >
              {question.options.map((option, optionIdx) => (
                <div
                  key={optionIdx}
                  className=""
                  style={{ display: "flex", gap: "6px" }}
                >
                  <input
                    onChange={(e) => handleTickOption(e, option)}
                    value={userAnswers}
                    type="radio"
                  />
                  <div>{option}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
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
    </div>
  );
};

export default Quiz;
