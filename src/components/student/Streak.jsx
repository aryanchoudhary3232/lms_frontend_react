import React, { useEffect, useState } from "react";

const Streak = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    async function load() {
      try {
        const res = await fetch(`${backendUrl}/student/streak`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error("Failed to load streak stats", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div style={{ padding: 28 }}>Loading streak...</div>;

  if (!stats) return <div style={{ padding: 28 }}>No data available.</div>;

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  return (
    <div style={{ width: "100%", padding: "28px", boxSizing: "border-box" }}>
      <h2>Streak & Activity</h2>
      <p className="muted">Overview of your recent activity</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginTop: 16 }}>
        <div className="analytics-card">
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2337AD" }}>{stats.activeDays}</div>
          <div style={{ color: "#666", marginTop: 6 }}>Days Active</div>
        </div>

        <div className="analytics-card">
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2337AD" }}>{stats.quizDays}</div>
          <div style={{ color: "#666", marginTop: 6 }}>Days with Quiz Attempts</div>
        </div>

        <div className="analytics-card">
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2337AD" }}>{stats.currentStreak}</div>
          <div style={{ color: "#666", marginTop: 6 }}>Current Streak (days)</div>
        </div>

        <div className="analytics-card">
          <div style={{ fontSize: 20, fontWeight: 700, color: "#2337AD" }}>{stats.bestStreak}</div>
          <div style={{ color: "#666", marginTop: 6 }}>Best Streak</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="quiz-panel">
        <h3>Last Active</h3>
        <p>{formatDate(stats.lastActiveDate)}</p>
        <small className="muted">Last recorded active date for streak tracking.</small>
      </div>
    </div>
  );
};

export default Streak;
