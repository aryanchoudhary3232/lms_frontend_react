import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Import the CSS file (adjust path if needed)
import "../common/StudentDashboard.css"; 

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to manually add learning minutes (for testing)
  const addLearningMinutes = async (minutes) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ minutes }),
        }
      );
      
      if (response.ok) {
        fetchDashboardData();
      } else {
        console.error("Failed to add learning minutes");
      }
    } catch (error) {
      console.error("Error adding learning minutes:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
        setStudent(data.data); 
      } else {
        console.error("Failed to fetch dashboard data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Data extractors
  const enrolledCount = dashboardData?.dashboardStats?.totalEnrolledCourses || 0;
  const currentStreak = dashboardData?.dashboardStats?.currentStreak || 0;
  const totalQuizzesTaken = dashboardData?.dashboardStats?.totalQuizzesTaken || 0;
  const globalQuizAverage = dashboardData?.dashboardStats?.globalQuizAverage || 0;
  const highestQuizScore = dashboardData?.dashboardStats?.highestQuizScore || 0;
  const studentName = dashboardData?.studentInfo?.name || "Student";
  
  // Chart Data Logic
  const formattedProgressData = dashboardData?.studentProgress?.length > 0
    ? dashboardData.studentProgress.map((data) => ({
        day: new Date(data.date).toLocaleDateString("en-us", {
          weekday: "short",
        }),
        minutes: data.minutes || 0,
      }))
    : (() => {
        const fallbackData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          fallbackData.push({
            day: date.toLocaleDateString("en-us", { weekday: "short" }),
            minutes: 0
          });
        }
        return fallbackData;
      })();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px", color: "#666" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Hi, {studentName}</h1>
        <p>Keep Learning!</p>
      </div>

      <div className="dashboard-content">
        
        {/* --- LEFT COLUMN --- */}
        <div className="left-column">
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{enrolledCount}</span>
              <span className="stat-label">Enrolled</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{currentStreak} 🔥</span>
              <span className="stat-label">Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{dashboardData?.dashboardStats?.totalWeeklyMinutes || 0}</span>
              <span className="stat-label">Mins/Week</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{dashboardData?.dashboardStats?.overallCompletionPercentage || 0}%</span>
              <span className="stat-label">Completion</span>
            </div>
          </div>

          {/* My Courses */}
          <div className="dashboard-card" style={{ minHeight: '300px' }}>
            <div className="card-title">My courses</div>
            
            <div className="courses-list">
              {dashboardData?.enrolledCourses?.length > 0 ? (
                dashboardData.enrolledCourses.map((item) => (
                  <div className="course-item" key={item.course._id}>
                    <img
                      src={item.course.image}
                      alt={item.course.title}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=Course")}
                    />
                    <div className="course-item-title">{item.course.title}</div>
                    <div className="course-meta">Quiz Avg: {item.avgQuizScore}%</div>
                    <div className="course-meta">
                      {item.completedTopics || 0}/{item.totalTopics || 0} topics
                    </div>
                  </div>
                ))
              ) : (
                <div style={{color: '#999', fontStyle: 'italic'}}>No courses enrolled yet.</div>
              )}
            </div>

            <Link to="/student/courses" className="continue-btn">
              Continue Learning
            </Link>
          </div>

          {/* Quiz Summary */}
          <div className="dashboard-card">
            <div className="card-title">Quiz Summary</div>
            <div className="quiz-stats-row">
              <div className="quiz-stat-item">
                <span className="quiz-stat-value">{totalQuizzesTaken}</span>
                <span className="quiz-stat-label">Attempts</span>
              </div>
              <div className="quiz-stat-item">
                <span className="quiz-stat-value">{globalQuizAverage}%</span>
                <span className="quiz-stat-label">Avg Accuracy</span>
              </div>
              <div className="quiz-stat-item">
                <span className="quiz-stat-value">{highestQuizScore}%</span>
                <span className="quiz-stat-label">Best Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="right-column">
          
          {/* Progress Chart */}
          <div className="dashboard-card" style={{ minHeight: '350px' }}>
            <div className="chart-header">
              <div className="card-title" style={{marginBottom: 0}}>Progress</div>
              
              {/* Test Buttons - Optional */}
              <div className="test-btn-group">
                <button 
                  onClick={() => addLearningMinutes(15)}
                  style={{
                    background: "#e0e7ff", color: "#4338ca", border: "none",
                    padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px"
                  }}
                >
                  +15m
                </button>
              </div>
            </div>
            
            <p style={{marginBottom: '20px', color: '#666', fontSize: '14px'}}>
                Weekly Learning Minutes
            </p>

            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedProgressData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="minutes" fill="#2337AD" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Announcements */}
          <div className="dashboard-card">
            <div className="card-title">Announcements</div>
            <div className="announcement-item">
              New course available: Advanced Python
            </div>
            <div className="announcement-item" style={{marginTop: '10px', borderLeftColor: '#ffd700'}}>
               System Maintenance scheduled for Sunday.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;