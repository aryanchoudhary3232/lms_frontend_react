import React, { useEffect, useState } from "react";
import "../../css/admin/Admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState({ students: [], teachers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.data);
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <h2>All Users</h2>

      <div className="admin-section">
        <h3 className="admin-section-title students">
          Students ({users.students.length})
        </h3>
        {users.students.length > 0 ? (
          <div className="admin-grid">
            {users.students.map((student) => (
              <div key={student._id} className="admin-card user">
                <h4>{student.name}</h4>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
                <p>
                  <strong>Role:</strong> Student
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">No students found</div>
        )}
      </div>

      <div className="admin-section">
        <h3 className="admin-section-title teachers">
          Teachers ({users.teachers.length})
        </h3>
        {users.teachers.length > 0 ? (
          <div className="admin-grid">
            {users.teachers.map((teacher) => (
              <div key={teacher._id} className="admin-card user">
                <h4>{teacher.name}</h4>
                <p>
                  <strong>Email:</strong> {teacher.email}
                </p>
                <p>
                  <strong>Role:</strong> Teacher
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty">No teachers found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
