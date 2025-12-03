import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { Link, useParams } from "react-router-dom";
import useLearningTimer from "../../helper/customHooks/useLearningTimer";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [studentId, setStudentId] = useState(null);

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

  // Helper functions
  const toggleChapter = (chIdx) => {
    if (openChapters.includes(chIdx)) {
      setOpenChapters(openChapters.filter((idx) => idx !== chIdx));
    } else {
      setOpenChapters([...openChapters, chIdx]);
    }
  };

  const isTopicCompleted = (chapterId, topicId) => {
    // Add your logic to check if topic is completed
    return false;
  };

  // Inline styles object
  const styles = {
    container: {
      display: "flex",
      gap: "24px",
      padding: "24px",
      maxWidth: "1800px",
      margin: "0 auto",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
    },
    sidebar: {
      width: "320px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      overflow: "hidden",
      height: "fit-content",
      maxHeight: "calc(100vh - 80px)",
      overflowY: "auto",
      position: "sticky",
      top: "20px",
      border: "1px solid #e8edf2",
    },
    sidebarTabs: {
      display: "flex",
      borderBottom: "1px solid #e8edf2",
      backgroundColor: "#fafbfc",
    },
    tab: {
      flex: 1,
      padding: "16px 12px",
      textAlign: "center",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.95rem",
      color: "#5f6368",
      transition: "all 0.2s ease",
      borderBottom: "3px solid transparent",
      position: "relative",
    },
    activeTab: {
      color: "#2337AD",
      borderBottom: "3px solid #2337AD",
      backgroundColor: "#fff",
    },
    chapterAccordion: {
      borderBottom: "1px solid #f0f2f5",
    },
    chapterHeader: {
      padding: "14px 16px",
      margin: 0,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.95rem",
      fontWeight: "700",
      color: "#1f2937",
      backgroundColor: "#fafbfc",
      transition: "all 0.2s ease",
      borderLeft: "3px solid transparent",
    },
    topicList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      backgroundColor: "#fff",
    },
    topicItem: {
      padding: "12px 16px 12px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "all 0.2s ease",
      fontSize: "0.9rem",
      color: "#4b5563",
      borderLeft: "3px solid transparent",
    },
    activeTopicItem: {
      backgroundColor: "#eff6ff",
      color: "#2337AD",
      fontWeight: "600",
      borderLeft: "3px solid #2337AD",
    },
    quizLink: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      textDecoration: "none",
      color: "#4f46e5",
      fontWeight: "600",
      fontSize: "0.875rem",
      width: "100%",
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      overflow: "hidden",
      border: "1px solid #e8edf2",
    },
  };

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
            <div style={{ 
              padding: "14px 16px", 
              borderBottom: "1px solid #f0f2f5",
              backgroundColor: "#fff",
            }}>
                <Link to={`/student/sidebar/courses/${courseId}/flashcards`} style={{ 
                  textDecoration: 'none', 
                  color: '#2337AD', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1a2a88';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#2337AD';
                }}
                >
                    <span style={{ fontSize: '1.1rem' }}>🗂️</span> Flashcards
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
            width: "100%",
            minHeight: "560px",
            backgroundColor: "#000",
            display: "block",
          }}
        />
        {/* Video Info Section */}
        <div style={{
          padding: "24px",
          borderTop: "1px solid #e8edf2",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 8px 0",
          }}>
            {course.title}
          </h2>
          <p style={{
            fontSize: "0.95rem",
            color: "#6b7280",
            lineHeight: "1.6",
            margin: 0,
          }}>
            {course.description}
          </p>
        </div>
      </div>

      {/* Right - Course Info Panel */}
      <div
        className="course-info-panel"
        style={{
          width: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Notes Card */}
        {course.notes && (
          <div style={{ 
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            padding: "20px",
            border: "1px solid #e8edf2",
          }}>
            <h3 style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#1f2937",
              margin: "0 0 16px 0",
            }}>Course Resources</h3>
            <a
              href={course.notes}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 20px",
                background: "#2337AD",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a2a88";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(35, 55, 173, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2337AD";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              📄 View / Download Notes (PDF)
            </a>
          </div>
        )}

        {/* Course Content Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "20px",
          border: "1px solid #e8edf2",
          maxHeight: "600px",
          overflowY: "auto",
        }}>
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 16px 0",
          }}>Course Content</h3>
          {course.chapters && course.chapters.length > 0 ? (
            course.chapters.map((chapter, chIdx) => (
              <div key={chIdx} style={{
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: chIdx !== course.chapters.length - 1 ? "1px solid #f0f2f5" : "none",
              }}>
                <h4 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <span style={{ color: "#2337AD" }}>📚</span>
                  {chapter.title}
                </h4>
                <div style={{ paddingLeft: "8px" }}>
                  {chapter.topics.map((topic, tpIdx) => (
                    <div key={tpIdx} style={{ marginBottom: "10px" }}>
                      <div
                        onClick={() => handleTopicClick(topic.video)}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          borderRadius: "6px",
                          fontSize: "0.9rem",
                          backgroundColor: selectedVideo === topic.video ? "#eff6ff" : "transparent",
                          color: selectedVideo === topic.video ? "#2337AD" : "#4b5563",
                          fontWeight: selectedVideo === topic.video ? "600" : "500",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          border: selectedVideo === topic.video ? "1px solid #bfdbfe" : "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedVideo !== topic.video) {
                            e.currentTarget.style.backgroundColor = "#f9fafb";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedVideo !== topic.video) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>🎥</span>
                        {topic.title}
                      </div>
                      <Link
                        to={`/student/courses/${course._id}/${chapter._id}/${topic._id}/quiz`}
                        style={{
                          marginLeft: "20px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          textDecoration: "none",
                          color: "#4f46e5",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          padding: "6px 0",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#3730a3";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#4f46e5";
                        }}
                      >
                        <span>📝</span> Quiz
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p style={{ 
              color: "#9ca3af",
              fontSize: "0.9rem",
              textAlign: "center",
              padding: "20px 0",
            }}>No chapters added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
