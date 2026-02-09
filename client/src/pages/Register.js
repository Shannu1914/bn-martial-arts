import React, { useState } from 'react';

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      alert('Registration successful. Please login.');
      onRegistered(); // go to login page
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="card auth-card">
      <h2>Student Registration</h2>

      <form onSubmit={submit}>
        <label>Name</label>
        <input
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
