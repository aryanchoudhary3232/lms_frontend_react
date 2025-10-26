import React, { useEffect, useState } from "react";
import { SectionCards } from "./components/section-cards";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import "../../css/teacher/Home.css";
import { Link, Outlet } from "react-router-dom";

export default function TeacherHome() {
  const [metrics, setMetrics] = useState(null);
  const [courseStats, setCourseStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodDays, setPeriodDays] = useState(30);

  const fetchMetrics = async (days = 30) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(
        `${backendUrl}/teacher/metrics?days=${days}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMetrics(data.data.metrics);
        setCourseStats(data.data.courseStats || []);
        setRevenueData(data.data.revenueByDay || []);

        // Set card data
        const cards = [
          {
            title: "Total Revenue",
            value: `₹${data.data.metrics.totalRevenue.toLocaleString()}`,
            change: `${data.data.metrics.revenueGrowthRate}%`,
            trend: parseFloat(data.data.metrics.revenueGrowthRate) >= 0 ? "up" : "down",
            description: `from last ${days} days`,
          },
          {
            title: "Total Students",
            value: data.data.metrics.totalCustomers.toString(),
            change: `${data.data.metrics.customerGrowthRate}%`,
            trend: parseFloat(data.data.metrics.customerGrowthRate) >= 0 ? "up" : "down",
            description: `enrolled students`,
          },
          {
            title: "New Students",
            value: data.data.metrics.newCustomers.toString(),
            change: "",
            trend: "neutral",
            description: `in last ${days} days`,
          },
          {
            title: "Active Courses",
            value: data.data.metrics.totalCourses.toString(),
            change: "",
            trend: "neutral",
            description: `published courses`,
          },
        ];
        setCardData(cards);
      } else {
        console.error("Error fetching metrics:", data.message);
      }
    } catch (error) {
      console.error("Error fetching teacher metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(periodDays);
  }, [periodDays]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">MyLMS</h1>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <Link to="/teacher/courses">Courses</Link>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h2>Welcome to MyLMS</h2>
        <p>Learn anytime, anywhere with our courses.</p>
        <a href="/courses" className="btn">
          Explore Courses
        </a>
      </header>

      {/* Courses Preview */}
      <section className="courses-preview">
        <h2>Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 1" />
            <h3>Web Development</h3>
            <p>Learn HTML, CSS, JavaScript and React.</p>
          </div>
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 2" />
            <h3>Data Science</h3>
            <p>Learn Python, Pandas, ML and AI basics.</p>
          </div>
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 3" />
            <h3>Mobile Development</h3>
            <p>Learn Flutter & React Native for apps.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="px-4 py-2 border rounded-md"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>

        <SectionCards cards={cardData} />

        <ChartAreaInteractive
          data={revenueData}
          title="Revenue Analytics"
          description={`Daily revenue for last ${periodDays} days`}
        />

        <DataTable
          data={courseStats}
          title="Course Performance"
          description="Overview of your courses"
        />
      </div>

      <Outlet />
    </div>
  );
}
