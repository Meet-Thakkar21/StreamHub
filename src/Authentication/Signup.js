import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }
  
      setSuccess('User created successfully');
      setError('');
  
      // Store a token or a flag in localStorage
      const data = await response.json();
      localStorage.setItem('authToken', data.token || 'userLoggedIn'); // Store a token or a simple flag
  
      // Navigate to homepage after successful signup
      navigate('/');
    } catch (err) {
      setError('An error occurred: ' + err.message);
    }
  };
  
  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>StreamHub</h1>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Join StreamHub</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="signup-input"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="signup-input"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="signup-input"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="signup-button">
          Sign Up
        </button>
        <p className="signup-footer">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
