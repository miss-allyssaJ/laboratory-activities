import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bgImage from '../assets/bg.png';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/notes');
    } catch (err) {
      setError(err.message || 'Error connecting to server.');
    }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      backgroundImage:`url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        width:360, padding:28, borderRadius:14, background:'rgba(255,255,255,0.95)',
        boxShadow:'0 8px 30px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{textAlign:'center', color:'#4B3A2F'}}>Notes</h1>

        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required
               style={inputStyle} />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required
               style={inputStyle} />

        <button type="submit" style={buttonStyle}>Login</button>
        {error && <p style={{color:'red', textAlign:'center'}}>{error}</p>}
        <p style={{textAlign:'center', marginTop:10}}>Don't have account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}

const inputStyle = {
  padding:'10px 12px', marginTop:10, borderRadius:8, border:'1px solid #d0c2b2', outline:'none', width:'100%'
};
const buttonStyle = {
  marginTop:12, padding:'10px', width:'100%', borderRadius:8, background:'#4B3A2F', color:'#fff', border:'none', cursor:'pointer'
};
