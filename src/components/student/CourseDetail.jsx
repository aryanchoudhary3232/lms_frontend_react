import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { Link, useLocation, useParams } from "react-router-dom";

const CourseDetail = () => {
  const [course, setCourse] = useState({});
  const [studentId, setStudentId] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEnroll, setIsEnroll] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const { courseId } = useParams();

  useEffect(() => {
    async function getStudentProfile() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/student/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setStudentId(data.data._id);
      } catch (error) {
        console.log("err occurred...", error);
      }
    }

    getStudentProfile();
  }, []);
  console.log(studentId);
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
          setCourse(courseResponse.data);
        } else {
          console.error("Error fetching course:", courseResponse.message);
        }
      } catch (error) {
        console.log("err occurred...", error);
      }
    }

    getCourseById();
  }, []);
  console.log("course", course);

  useEffect(() => {
    if (course?.students && studentId) {
      console.log(".........", course);
      setIsEnroll(course.students.includes(studentId));
    }
  }, [course, studentId]);
  console.log("isEnroll", isEnroll);
  useEffect(() => {
    // Page load pe default video = course intro
    if (course?.video) {
      setSelectedVideo(course.video);
    }
  }, [course]);

  if (!course) return <p>Loading...</p>;

  const handleTopicClick = (tpVideo, chIdx, tpIdx) => {
    if ((isEnroll || (chIdx == 0 && tpIdx == 0)) && tpVideo) {
      setSelectedVideo(tpVideo);
    } else if (!isEnroll) {
      setShowPopUp(true);
    }
  };

  return (
    <div
      className="course-player-wrapper"
      style={{
        display: "flex",
        // gap: "12rem",
        margin: "5px 5px 5px 5px",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Left - Video Player */}
      <div
        className="player-left"
        style={{
          width: "75%",
        }}
      >
        <video
          src={selectedVideo}
          controls
          style={{
            borderRadius: "12px",
            width: "100%",
          }}
        />
      </div>

      {/* Right - Chapters + Topics */}
      <div
        className="player-right"
        style={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          marginLeft: "53px",
          marginTop: "12px",
        }}
      >
        <h2 className="course-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>
        {course.notes ? (
          <div style={{ margin: "8px 0" }}>
            <a
              href={course.notes}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: "#2337ad",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              View / Download Notes (PDF)
            </a>
          </div>
        ) : null}

        <div
          className="chapters-list"
          style={{
            width: "100%",
          }}
        >
          {course.chapters && course.chapters.length > 0 ? (
            course.chapters.map((chapter, chIdx) => (
              <div key={chIdx} className="chapter-card">
                <h3>{chapter.title}</h3>
                <ul>
                  {chapter.topics.map((topic, tpIdx) => (
                    <div key={tpIdx}>
                      <li
                        className={`topic-item ${
                          selectedVideo === topic.video ? "active" : ""
                        }`}
                        onClick={() =>
                          handleTopicClick(topic.video, chIdx, tpIdx)
                        }
                      >
                        {topic.title}
                      </li>
                      <Link
                        to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                        style={{
                          marginLeft: "12px",
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "600",
                        }}
                      >
                        Quiz
                      </Link>
                    </div>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No chapters added yet.</p>
          )}
        </div>
      </div>

      {showPopUp && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            className=""
            style={{
              background: "white",
              width: "30%",
              height: "30%",
              margin: "12rem auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                fontSize: "2rem",
              }}
            >
              <span>You need to enroll</span>
              <span>to watch the video</span>
            </h2>
            <div
              className=""
              style={{
                display: "flex",
                gap: "5px",
                flexDirection: "column",
                width: "45%",
              }}
            >
              <Link
                to={``}
                style={{
                  border: "none",
                  background: "rgb(35, 55, 173)",
                  color: "white",
                  fontSize: "24px",
                  padding: "12px 36px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Enroll Now
              </Link>
              <button
                style={{
                  border: "none",
                  background: "gray",
                  color: "white",
                  fontSize: "24px",
                  padding: "12px 36px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowPopUp(false)}
              >
                {" "}
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
