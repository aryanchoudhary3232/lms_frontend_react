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
        <h2>Your Dashboard</h2>
        <p>{`You have ${totalCourses} enrolled course${totalCourses !== 1 ? "s" : ""}`}</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="student-dashboard-grid">
          <section className="enrolled-courses">
            <h3>Enrolled Courses</h3>
            {enrolled.length === 0 ? (
              <p>You are not enrolled in any courses yet.</p>
            ) : (
              <div className="courses-list">
                {enrolled.map((c) => (
                  <Link to={`/student/courses/${c._id}`} className="course-card" key={c._id}>
                    <img src={c.image} alt={c.title} />
                    <div className="course-meta">
                      <h4>{c.title}</h4>
                      <p>{c.description}</p>
                      <p>
                        <strong>Teacher:</strong> {c.teacher?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="student-analytics">
            <h3>Analytics</h3>
            <div className="analytics-card">
              <p>
                <strong>Courses bought/enrolled:</strong> {totalCourses}
              </p>
              <p>
                <strong>Total spent:</strong> ₹-- (payment tracking not implemented)
              </p>
            </div>

            <div className="analytics-card">
              <h4>Quiz Summary</h4>
              {quizStats.length === 0 ? (
                <p>No quiz attempts yet.</p>
              ) : (
                <ul>
                  {quizStats.map((qs) => (
                    <li key={qs.courseId || qs.courseTitle}>
                      <strong>{qs.courseTitle || "Course"}</strong>
                      <div>
                        Attempts: {qs.attempts} — Avg: {qs.averageScore} — Latest: {qs.latestScore}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
