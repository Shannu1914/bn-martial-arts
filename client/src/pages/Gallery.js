import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Gallery() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/api/students');
        setStudents(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load students');
      }
    }
    load();
  }, []);

  return (
    <div>
      <h2>Student Gallery</h2>
      <div className="gallery">
        {students.length === 0 && <p>No students yet.</p>}
        {students.map(s => (
          <div key={s.id} className="card">
            {s.photo_url ? (
              <img src={`http://localhost:4000${s.photo_url}`} alt={s.name} className="thumb" />
            ) : (
              <div className="thumb placeholder">No photo</div>
            )}
            <div className="card-body">
              <strong>{s.name}</strong>
              <div>Age: {s.age || '-'}</div>
              <div>Grade: {s.grade || '-'}</div>
              <div>{s.notes || ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
