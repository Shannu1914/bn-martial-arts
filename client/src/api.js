const API_BASE = process.env.REACT_APP_API_BASE || 'https://bn-martial-arts.onrender.com';

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    const body = await res.json().catch(()=>({}));
    const err = new Error(body.message || 'API error');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}
