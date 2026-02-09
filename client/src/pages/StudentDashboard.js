import React, { useEffect, useState } from 'react';

export default function StudentDashboard({ token }) {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    loadProfile();
    loadEnrollments();
  }, []);

  async function loadProfile() {
    const res = await fetch('http://localhost:4000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setProfile(data);
  }

  async function loadEnrollments() {
    const res = await fetch('http://localhost:4000/api/enrollments/mine', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setEnrollments(data);
  }

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>

      {profile && (
        <div className="card">
          <h3>My Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}

      <div className="card">
        <h3>My Enrollments</h3>

        {enrollments.length === 0 ? (
          <p>No enrollments yet.</p>
        ) : (
          <ul>
            {enrollments.map(e => (
              <li key={e.id}>
                <strong>{e.class_preference}</strong> – {e.status || 'Pending'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
