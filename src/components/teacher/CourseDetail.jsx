import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { courseId } = useParams();

  useEffect(() => {
    async function getCourseById() {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/teacher/courses/get_course_by_id/${courseId}`
        );
        const courseResponse = await response.json();

        if (response.ok) {
          setCourse(courseResponse.data);
        }
      } catch (error) {}
    }

    getCourseById();
  }, []);

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
    <div className="course-player-wrapper">
      {/* Left - Video Player */}
      <div className="player-left">
        <video src={selectedVideo} controls className="main-video" />
      </div>

      {/* Right - Chapters + Topics */}
      <div className="player-right">
        <h2 className="course-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>

        <div className="chapters-list">
          {course.chapters && course.chapters.length > 0 ? (
            course.chapters.map((chapter, chIdx) => (
              <div key={chIdx} className="chapter-card">
                <h3>{chapter.title}</h3>
                <ul>
                  {chapter.topics.map((topic, tpIdx) => (
                    <li
                      key={tpIdx}
                      className={`topic-item ${
                        selectedVideo === topic.video ? "active" : ""
                      }`}
                      onClick={() => handleTopicClick(topic.video)}
                    >
                      {topic.title}
                    </li>
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
