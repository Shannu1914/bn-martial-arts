import React, { useState } from 'react';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import Enroll from './pages/Enroll';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';


function App() {
  const [page, setPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const role = localStorage.getItem('role');

  function logout() {
    setToken(null);
    localStorage.removeItem('token');
    setPage('home');
  }

  return (
    <div className={role === 'admin' ? 'admin-theme' : 'student-theme'}>
      <nav className="nav">
        <h1 className="brand">BN Martial Arts</h1>
        <div className="nav-links">
          <button onClick={()=>setPage('home')}>Home</button>
          <button onClick={()=>setPage('gallery')}>Student Gallery</button>
          <button onClick={()=>setPage('enroll')}>Enroll</button>

          {!token ? (
            <>
              <button onClick={()=>setPage('login')}>Login</button>
              <button onClick={()=>setPage('register')}>Register</button>
            </>
          ) : (
            <>
              <button onClick={()=>setPage('dashboard')}>Dashboard</button>
              <button onClick={logout}>Logout</button>
            </>
          )}

        </div>
      </nav>

      <main className="container">
        {page === 'home' && <Home />}
        {page === 'gallery' && <Gallery />}
        {page === 'enroll' && <Enroll />}
        {page === 'login' && <Login onLogin={(t,r)=>{
          setToken(t);
          localStorage.setItem('token', t);
          localStorage.setItem('role', r);
          setPage('dashboard');
        }} />}        
        {page === 'register' && <Register />}
        {page === 'dashboard' && role === 'admin' && <AdminDashboard token={token} />}
        {page === 'dashboard' && role === 'student' && <StudentDashboard />}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} BN Martial Arts
      </footer>
    </div>
  );
}

export default App;
