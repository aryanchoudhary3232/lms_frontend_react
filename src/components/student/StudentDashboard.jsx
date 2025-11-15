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
  const data = [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 70 },
    { day: "Thu", minutes: 90 },
    { day: "Fri", minutes: 65 },
    { day: "Sat", minutes: 45 },
    { day: "Sun", minutes: 30 },
  ];

  const [student, setStudent] = useState([]);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setStudent(data.data);
    };

    fetchStudentProgress();
  }, []);
  const formattedProgressData = student?.studentProgress
    ?.slice(-7)
    .map((data) => {
      return {
        day: new Date(data.date).toLocaleDateString("en-us", {
          weekday: "short",
        }),
        minutes: data.minutes,
      };
    })
    .reverse();


  return (
    <div
      style={{ padding: "12px 47px", width: "100%", boxSizing: "border-box" }}
    >
      <div className="heading" style={{ height: "4rem" }}>
        <div style={{ fontSize: "27px", fontWeight: 700 }}>Hi, Aryan</div>
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
            style={{ display: "flex", gap: "16px", marginTop: "26px" }}
          >
            <div
              className=""
              style={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                width: "42%",
                height: "83px",
                padding: "12px 20px",
                justifyContent: "center",
                borderRadius: "4px",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "37px", fontWeight: "bold" }}>
                {student?.enrolledCourses?.length}
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
                width: "42%",
                height: "83px",
                padding: "12px 20px",
                justifyContent: "center",
                borderRadius: "4px",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "37px", fontWeight: "bold" }}>2</span>
              <span
                style={{
                  paddingTop: "3px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Completed
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
                style={{ display: "flex", gap: "18px", marginTop: "-6px" }}
              >
                {student?.enrolledCourses?.map((course) => (
                  <div className="" key={course._id}>
                    {" "}
                    <img
                      style={{
                        width: "216px",
                        borderRadius: "4px",
                      }}
                      src={course.image}
                      alt=""
                    />
                    <div style={{ fontSize: "17px", fontWeight: "550" }}>
                      {course.title}
                    </div>
                  </div>
                ))}
              </div>
              <Link to={`/student/sidebar/courses`}
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
                  textDecoration: 'none',
                  textAlign: 'center'
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
                  2
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
                  80%
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
                  10
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
              <span style={{ fontSize: "24px", fontWeight: 600 }}>
                Progress Chart
              </span>
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
