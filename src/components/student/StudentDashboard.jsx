import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/student/Home.css";

const StudentDashboard = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    async function load() {
      try {
        const [coursesRes, quizRes] = await Promise.all([
          fetch(`${backendUrl}/student/enrolled-courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${backendUrl}/student/quiz-submissions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const coursesJson = await coursesRes.json();
        const quizJson = await quizRes.json();

        if (coursesJson.success) setEnrolled(coursesJson.data || []);
        if (quizJson.success) setQuizStats(quizJson.data || []);
      } catch (err) {
        console.error("StudentDashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalCourses = enrolled.length;

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-header">
        <div>
          <h2>Your Dashboard</h2>
          <p className="muted">{`You have ${totalCourses} enrolled course${totalCourses !== 1 ? "s" : ""}`}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Enrolled courses full-width section */}
          <section className="enrolled-courses-section">
            <h3>Enrolled Courses</h3>
            {enrolled.length === 0 ? (
              <p className="muted">You are not enrolled in any courses yet.</p>
            ) : (
              <div className="courses-grid">
                {enrolled.map((c) => (
                  <Link to={`/student/courses/${c._id}`} className="course-card" key={c._id}>
                    <div className="course-card-media">
                      <img src={c.image} alt={c.title} />
                    </div>
                    <div className="course-card-body">
                      <h4 className="course-title">{c.title}</h4>
                      <p className="course-desc">{c.description}</p>
                      <div className="course-meta-row">
                        <span className="course-teacher">{c.teacher?.name}</span>
                        <button className="btn small">Start</button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Bottom area: analytics + quiz summary */}
          <div className="dashboard-bottom">
            <section className="analytics-panel">
              <h3>Analytics</h3>
              <div className="analytics-cards">
                <div className="analytics-card">
                  <div className="analytic-number">{totalCourses}</div>
                  <div className="analytic-label">Courses Enrolled</div>
                </div>
                <div className="analytics-card">
                  <div className="analytic-number">₹--</div>
                  <div className="analytic-label">Total Spent</div>
                </div>
              </div>
            </section>

            <aside className="quiz-panel">
              <h3>Quiz Summary</h3>
              {quizStats.length === 0 ? (
                <p className="muted">No quiz attempts yet.</p>
              ) : (
                <div className="quiz-list">
                  {quizStats.map((qs) => (
                    <div className="quiz-item" key={qs.courseId || qs.courseTitle}>
                      <div className="quiz-item-title">{qs.courseTitle || "Course"}</div>
                      <div className="quiz-item-meta">Attempts: {qs.attempts}</div>
                      <div className="quiz-item-meta">Avg: {qs.averageScore} • Latest: {qs.latestScore}</div>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
