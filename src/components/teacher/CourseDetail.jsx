import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { Link, useLocation, useParams } from "react-router-dom";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { courseId } = useParams();

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
  console.log('course',course)

  useEffect(() => {
    // Page load pe default video = course intro
    if (course?.video) {
      setSelectedVideo(course.video);
    }
  }, [course]);

  if (!course) return <p>Loading...</p>;

  const handleTopicClick = (tpVideo) => {
    if (tpVideo) {
      setSelectedVideo(tpVideo);
    } else if (course.video) {
      setSelectedVideo(course.video); // fallback to intro
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
          marginTop: '12px'
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
                        onClick={() => handleTopicClick(topic.video)}
                      >
                        {topic.title}
                      </li>
                      <Link
                        to={`/teacher/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
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
    </div>
  );
};

export default CourseDetail;
