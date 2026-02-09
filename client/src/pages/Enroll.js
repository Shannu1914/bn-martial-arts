import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function Enroll() {
  const [form, setForm] = useState({
    student_name: '',
    age: '',
    school: '',
    parent_name: '',
    phone: '',
    class_preference: '',
    message: ''
  });

  async function submit(e) {
    e.preventDefault();
    try {
      await apiFetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert('Enrollment submitted successfully!');
      setForm({});
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Student Enrollment Form</h2>
      <form onSubmit={submit} className="admin-form">
        <input placeholder="Student Name" required
          onChange={e=>setForm({...form, student_name:e.target.value})} />

        <input placeholder="Age"
          onChange={e=>setForm({...form, age:e.target.value})} />

        <input placeholder="School"
          onChange={e=>setForm({...form, school:e.target.value})} />

        <input placeholder="Parent Name"
          onChange={e=>setForm({...form, parent_name:e.target.value})} />

        <input placeholder="Phone Number" required
          onChange={e=>setForm({...form, phone:e.target.value})} />

        <input placeholder="Preferred Class (Morning/Evening)"
          onChange={e=>setForm({...form, class_preference:e.target.value})} />

        <textarea placeholder="Message"
          onChange={e=>setForm({...form, message:e.target.value})} />

        <button type="submit">Submit Enrollment</button>
      </form>
    </div>
  );
}
