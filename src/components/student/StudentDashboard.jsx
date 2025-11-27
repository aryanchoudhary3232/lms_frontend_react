import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

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
        // Refresh dashboard data
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
        setStudent(data.data); // Keep for backward compatibility
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

  // Get data from dashboardData with fallbacks
  const enrolledCount = dashboardData?.dashboardStats?.totalEnrolledCourses || 0;
  const currentStreak = dashboardData?.dashboardStats?.currentStreak || 0;
  const totalQuizzesTaken = dashboardData?.dashboardStats?.totalQuizzesTaken || 0;
  const globalQuizAverage = dashboardData?.dashboardStats?.globalQuizAverage || 0;
  const highestQuizScore = dashboardData?.dashboardStats?.highestQuizScore || 0;
  const studentName = dashboardData?.studentInfo?.name || "Student";
  
  // Format progress data for chart
  const formattedProgressData = dashboardData?.studentProgress?.length > 0
    ? dashboardData.studentProgress.map((data) => ({
        day: new Date(data.date).toLocaleDateString("en-us", {
          weekday: "short",
        }),
        minutes: data.minutes || 0,
      }))
    : (() => {
        // Generate fallback data for the last 7 days
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
      <div style={{ padding: "12px 47px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }
  return (
    <div
      style={{ padding: "12px 47px", width: "100%", boxSizing: "border-box" }}
    >
      <div className="heading" style={{ height: "4rem" }}>
        <div style={{ fontSize: "27px", fontWeight: 700 }}>Hi, {studentName}</div>
        <div style={{ marginTop: "5px", marginBottom: "12px" }}>
          Keep Learning!
        </div>
      </div>
      <div className="" style={{ display: "flex" }}>
        <div
          className="left-part"
          style={{ width: "50%", boxSizing: "border-box" }}
        >
          <div
            className=""
            style={{ display: "flex", gap: "16px", marginTop: "26px", flexWrap: "wrap" }}
          >
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "30%",
                height: "83px",
                padding: "12px 20px",
                justifyContent: "center",
                borderRadius: "4px",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "37px", fontWeight: "bold" }}>
                {enrolledCount}
              </span>

              <span
                style={{
                  paddingTop: "3px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Courses Enrolled
              </span>
            </div>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "30%",
                height: "83px",
                padding: "12px 20px",
                justifyContent: "center",
                borderRadius: "4px",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "37px", fontWeight: "bold" }}>
                {currentStreak} 🔥
              </span>
              <span
                style={{
                  paddingTop: "3px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Current Streak
              </span>
            </div>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "30%",
                height: "83px",
                padding: "12px 20px",
                justifyContent: "center",
                borderRadius: "4px",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "37px", fontWeight: "bold" }}>
                {dashboardData?.dashboardStats?.totalWeeklyMinutes || 0}
              </span>
              <span
                style={{
                  paddingTop: "3px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Weekly Minutes
              </span>
            </div>
          </div>
          <div className="">
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "23px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "90%",
                padding: "16px 25px",
                marginTop: "23px",
                borderRadius: "4px",
                position: "relative",
                height: "300px",
              }}
            >
              <div className="" style={{ fontSize: "24px", fontWeight: 600 }}>
                My courses
              </div>
              <div
                className=""
                style={{
                  display: "flex",
                  gap: "18px",
                  marginTop: "-6px",
                  // flexWrap: "wrap",
                }}
              >
                {dashboardData?.enrolledCourses?.map((item) => (
                  <div className="" key={item.course._id}>
                    <img
                      style={{
                        width: "100%",
                        borderRadius: "4px",
                      }}
                      src={item.course.image}
                      alt=""
                    />
                    <div style={{ fontSize: "17px", fontWeight: "550" }}>
                      {item.course.title}
                    </div>
                    <div className="course-score">
                      Quiz Avg: {item.avgQuizScore}%
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to={`/student/sidebar/courses`}
                style={{
                  background: "#2337AD",
                  border: "none",
                  color: "white",
                  width: "20%",
                  padding: "6px 6px",
                  borderRadius: "4px",
                  position: "absolute",
                  right: "33px",
                  bottom: "0px",
                  marginTop: "13px",
                  fontSize: "19px",
                  marginBottom: "12px",
                  cursor: "pointer",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Continue
              </Link>
            </div>
          </div>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "38px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              width: "90%",
              padding: "16px 25px",
              marginTop: "23px",
              borderRadius: "4px",
              position: "relative",
              height: "163px",
            }}
          >
            <div className="" style={{ fontSize: "24px", fontWeight: 600 }}>
              Quiz Summary
            </div>
            <div className="" style={{ display: "flex", gap: "66px" }}>
              <div
                className=""
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#4f46e5",
                  }}
                >
                  {totalQuizzesTaken}
                </span>
                <span>Attempts</span>
              </div>{" "}
              <div
                className=""
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#4f46e5",
                  }}
                >
                  {globalQuizAverage}%
                </span>
                <span>Average accuracy</span>
              </div>{" "}
              <div
                className=""
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#4f46e5",
                  }}
                >
                  {highestQuizScore}%
                </span>
                <span>Highest score</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right-part" style={{ width: "50%" }}>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "23px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              width: "94%",
              padding: "16px 25px",
              marginTop: "27px",
              borderRadius: "4px",
              position: "relative",
              height: "320px",
            }}
          >
            {" "}
            <div
              className=""
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "24px", fontWeight: 600 }}>
                  Progress Chart
                </span>
                {/* Test button for adding minutes - can be removed in production */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <button 
                    onClick={() => addLearningMinutes(15)}
                    style={{
                      background: "#4F46E5",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                    title="Add 15 minutes (test)"
                  >
                    +15min
                  </button>
                  <button 
                    onClick={() => addLearningMinutes(30)}
                    style={{
                      background: "#4F46E5",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                    title="Add 30 minutes (test)"
                  >
                    +30min
                  </button>
                </div>
              </div>
              <span style={{ marginTop: "23px" }}>Weekly Learning Minutes</span>
            </div>
            <div className="">
              <ResponsiveContainer width={"100%"} height={250}>
                <BarChart data={formattedProgressData}>
                  <XAxis dataKey={"day"} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={"minutes"} fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "23px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              width: "93%",
              padding: "16px 25px",
              marginTop: "16px",
              borderRadius: "4px",
              position: "relative",
              height: "320px",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: 600 }}>
              Anouncements
            </span>
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "23px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "93%",
                padding: "16px 25px",
                marginTop: "16px",
                borderRadius: "4px",
                position: "relative",
                height: "177px",
              }}
            >
              <span style={{ fontSize: "21px", fontWeight: 600 }}>
                New course: Advanced Python
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
