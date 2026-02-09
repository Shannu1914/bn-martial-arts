import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ token }) {
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]); // ✅ NEW
  const [form, setForm] = useState({
    name: '',
    age: '',
    grade: '',
    notes: '',
    photo: null
  });

  useEffect(() => {
    loadStudents();
    loadEnrollments(); // ✅ NEW
  }, []);

  /* ---------------- STUDENTS ---------------- */

  async function loadStudents() {
    const res = await fetch('http://localhost:4000/api/students');
    const data = await res.json();
    setStudents(data);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name) return alert('Name required');

    const fd = new FormData();
    fd.append('name', form.name);
    if (form.age) fd.append('age', form.age);
    if (form.grade) fd.append('grade', form.grade);
    if (form.notes) fd.append('notes', form.notes);
    if (form.photo) fd.append('photo', form.photo);

    try {
      const res = await fetch('http://localhost:4000/api/students', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Error');
      }

      setForm({ name: '', age: '', grade: '', notes: '', photo: null });
      await loadStudents();
      alert('Student added');
    } catch (err) {
      alert(err.message);
    }
  }

  async function del(id) {
    if (!window.confirm('Delete student?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Delete failed');
      }

      await loadStudents();
    } catch (err) {
      alert(err.message);
    }
  }

  /* ---------------- ENROLLMENTS ---------------- */

  async function loadEnrollments() {
    try {
      const res = await fetch('http://localhost:4000/api/enroll', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      alert('Failed to load enrollments');
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* ---------- ADD STUDENT ---------- */}
      <form onSubmit={submit} className="admin-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Age"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
        />
        <input
          placeholder="Grade"
          value={form.grade}
          onChange={e => setForm({ ...form, grade: e.target.value })}
        />
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, photo: e.target.files[0] })}
        />
        <button type="submit">Add Student</button>
      </form>

      {/* ---------- STUDENTS LIST ---------- */}
      <h3>Existing Students</h3>
      <div className="gallery">
        {students.map(s => (
          <div key={s.id} className="card admin-card">
            {s.photo_url ? (
              <img
                src={`http://localhost:4000${s.photo_url}`}
                alt={s.name}
                className="thumb"
              />
            ) : (
              <div className="thumb placeholder">No photo</div>
            )}
            <div className="card-body">
              <strong>{s.name}</strong>
              <div>Age: {s.age || '-'}</div>
              <div>Grade: {s.grade || '-'}</div>
              <button onClick={() => del(s.id)} className="danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- ENROLLMENTS ---------- */}
      <h3 style={{ marginTop: '40px' }}>New Enrollments</h3>

      {enrollments.length === 0 ? (
        <p>No enrollments yet</p>
      ) : (
        <table className="enroll-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Parent</th>
              <th>Phone</th>
              <th>Class</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(e => (
              <tr key={e.id}>
                <td>{e.student_name}</td>
                <td>{e.parent_name || '-'}</td>
                <td>{e.phone}</td>
                <td>{e.class_preference || '-'}</td>
                <td>{new Date(e.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
