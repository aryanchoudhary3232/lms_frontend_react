import React from "react";
import "../../css/admin/Dashboard.css";

const metricCards = [
    { label: "Courses", value: "5", delta: "+10%" },
    { label: "Students", value: "250", delta: "+5%" },
    { label: "Revenue", value: "$12,500", delta: "+15%" },
    { label: "Recent Orders", value: "10", delta: "+2%" },
];

const weeklyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

const engagementBars = [
    { label: "Course A", value: 92 },
    { label: "Course B", value: 86 },
    { label: "Course C", value: 80 },
    { label: "Course D", value: 72 },
    { label: "Course E", value: 78 },
];

const recentOrders = [
    {
        id: "#12345",
        name: "Sophia Clark",
        course: "Introduction to Programming",
        amount: "$150",
        date: "2024-07-20",
    },
    {
        id: "#12346",
        name: "Ethan Miller",
        course: "Advanced Data Analysis",
        amount: "$200",
        date: "2024-07-21",
    },
    {
        id: "#12347",
        name: "Olivia Davis",
        course: "Digital Marketing Fundamentals",
        amount: "$100",
        date: "2024-07-22",
    },
    {
        id: "#12348",
        name: "Liam Wilson",
        course: "Project Management Essentials",
        amount: "$180",
        date: "2024-07-23",
    },
    {
        id: "#12349",
        name: "Ava Martinez",
        course: "Creative Writing Workshop",
        amount: "$120",
        date: "2024-07-24",
    },
];

export default function AdminDashboard() {
    return (
        <div className="main-page">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
            </header>

            <section className="metrics-grid" aria-label="Key metrics">
                {metricCards.map((card) => (
                    <article className="metric-card" key={card.label}>
                        <p className="metric-label">{card.label}</p>
                        <p className="metric-value">{card.value}</p>
                        <span className={`metric-delta ${card.delta.startsWith("+") ? "positive" : "negative"}`}>
                            {card.delta}
                        </span>
                    </article>
                ))}
            </section>

            <section className="section-block" aria-labelledby="course-performance">
                <h2 id="course-performance" className="section-title">
                    Course Performance
                </h2>

                <div className="performance-grid">
                    <article className="chart-card" aria-label="Enrollment trends">
                        <div className="chart-header">
                            <p className="chart-title">Enrollment Trends</p>
                            <p className="chart-value">+15%</p>
                        </div>
                        <div className="chart-subtext">
                            <span className="chart-muted">Last 30 Days</span>
                            <span className="chart-positive">+5%</span>
                        </div>
                        <div className="line-chart" role="img" aria-label="Enrollment growth over four weeks">
                            <svg viewBox="0 0 400 140" preserveAspectRatio="none">
                                <path
                                    d="M0 110 C 40 80, 80 140, 120 95 C 160 50, 200 150, 240 95 C 280 45, 320 135, 360 80 C 380 65, 400 95, 400 95 L 400 140 L 0 140 Z"
                                    fill="#CBDCEB"
                                />
                                <path
                                    d="M0 110 C 40 80, 80 140, 120 95 C 160 50, 200 150, 240 95 C 280 45, 320 135, 360 80 C 380 65, 400 95, 400 95"
                                    fill="none"
                                    stroke="#6D94C5"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div className="chart-axis">
                            {weeklyLabels.map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
                    </article>

                    <article className="chart-card" aria-label="Student engagement">
                        <div className="chart-header">
                            <p className="chart-title">Student Engagement</p>
                            <p className="chart-value">+8%</p>
                        </div>
                        <div className="chart-subtext">
                            <span className="chart-muted">Last 30 Days</span>
                            <span className="chart-positive">+3%</span>
                        </div>
                        <div className="bar-chart" role="img" aria-label="Engagement by course">
                            {engagementBars.map((bar) => (
                                <div className="bar" key={bar.label}>
                                    <div className="bar-fill" style={{ height: `${bar.value}%` }} />
                                    <span className="bar-label">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </section>

            <section className="section-block" aria-labelledby="recent-orders">
                <h2 id="recent-orders" className="section-title">
                    Recent Orders
                </h2>
                <div className="orders-card">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th scope="col">Order ID</th>
                                <th scope="col">Student Name</th>
                                <th scope="col">Course</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.name}</td>
                                    <td>{order.course}</td>
                                    <td>{order.amount}</td>
                                    <td>{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}