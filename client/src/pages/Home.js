import React, { useEffect, useState } from 'react';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <h2>Welcome to BN Martial Arts 🥋</h2>
        <p>Discipline • Strength • Confidence</p>
      </section>

      <section>
        <h3 className="section-title">Our Students</h3>

        {loading && <p>Loading students...</p>}

        <div className="student-grid">
          {students.map(s => (
            <div key={s.id} className="student-card">
              {s.photo_url ? (
                <img
                  src={`http://localhost:4000${s.photo_url}`}
                  alt={s.name}
                />
              ) : (
                <div className="no-photo">No Photo</div>
              )}

              <div className="student-info">
                <strong>{s.name}</strong>
                <div className="muted">
                  Grade: {s.grade || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && students.length === 0 && (
          <p>No students added yet.</p>
        )}
      </section>
    </div>
  );
}
