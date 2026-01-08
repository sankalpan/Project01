import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // const res = await fetch('http://localhost:5000/api/register', {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password,phone })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful!');
      navigate('/login'); 
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <div className="container col-md-4 mt-5">
      <h2 className="text-center">Register</h2>
      <div className='form_design'>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
       <label>Name</label>
       <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
        <label>Phone</label>
        <input type="tel" className="form-control" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      </div>
    </div>
  );
}
