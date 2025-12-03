import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { Link, useParams } from "react-router-dom";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { courseId } = useParams();

  // State for the new UI elements
  // 'materi' or 'komentar'
  const [activeTab, setActiveTab] = useState("materi");
  // Keep track of which chapters are open, start with first open

  const { isActive, formattedTime, currentSessionMinutes } = useLearningTimer();
  const [openChapters, setOpenChapters] = useState([0]); 
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState(null);

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

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const token = localStorage.getItem("token");
        
        const response = await fetch(
          `${backendUrl}/student/courses/${courseId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
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
    <div style={styles.container}>
      {/* ===== LEFT SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "materi" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("materi")}
          >
            Material
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "komentar" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("komentar")}
          >
            Comments
          </div>
        </div>

        {activeTab === "materi" && (
          <div className="chapters-list">
            {/* Flashcards Link */}
            <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
                <Link to={`/student/sidebar/courses/${courseId}/flashcards`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                    <span>🗂️</span> Flashcards
                </Link>
            </div>

            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter, chIdx) => (
                <div key={chIdx} style={styles.chapterAccordion}>
                  <h3
                    style={styles.chapterHeader}
                    onClick={() => toggleChapter(chIdx)}
                  >
                    {chapter.title}
                    <span>{openChapters.includes(chIdx) ? "▲" : "▼"}</span>
                  </h3>
                  {openChapters.includes(chIdx) && (
                    <ul style={styles.topicList}>
                      {chapter.topics.map((topic, tpIdx) => (
                        <React.Fragment key={tpIdx}>
                          {/* Video Item */}
                          <li
                            style={{
                              ...styles.topicItem,
                              ...(selectedVideo === topic.video
                                ? styles.activeTopicItem
                                : {}),
                            }}
                            onClick={() =>
                              handleTopicClick(topic.video, chIdx, tpIdx, chapter._id, topic._id)
                            }
                          >
                            <span>🎥</span>
                            {topic.title}
                            {isTopicCompleted(chapter._id, topic._id) && (
                              <span style={{ color: 'green', marginLeft: '8px' }}>✓</span>
                            )}
                          </li>
                          {/* Quiz Item */}
                          <li
                            style={{ ...styles.topicItem, cursor: "default" }}
                          >
                            <Link
                              to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                              style={styles.quizLink}
                            >
                              <span>📝</span>
                              Quiz: {topic.title}
                            </Link>
                          </li>
                        </React.Fragment>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <p style={{ padding: "16px" }}>No chapters added yet.</p>
            )}
          </div>
        )}

        {activeTab === "komentar" && (
          <div style={{ padding: "16px" }}>
            <p>Comments feature coming soon.</p>
          </div>
        )}
      </div>

      {/* ===== RIGHT MAIN CONTENT ===== */}
      <div style={styles.mainContent}>
        {/* Video Player */}
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
    </div>
  );
};

export default CourseDetail;
