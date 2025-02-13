import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response:', response.body);

    if (response.ok) {
      console.log('Signup successful');
      Navigate('/login?message=signup_success');    // Redirect to login page with success message
    } else {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      } else {
        setError('Signup failed, bad JSON response');
      }
    }
  };

  return (
    <div>
        <div className="formContainer signup">
            <div className="formContainer-signup">
                <div>
                    <h1>Sign Up</h1>
                    {error && <p className="errorMessage">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="formField formField-email">
                            <label htmlFor="email" className="formLabel">Email</label>
                            <input 
                              type="email" 
                              className="formInput" 
                              id="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                        </div>
                        <div className="formField formField-password">
                            <label htmlFor="password" className="formLabel">Password</label>
                            <input 
                              type="password" 
                              className="formInput" 
                              id="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                        </div>
                        <div className="formField formField-confirmPassword">
                            <label htmlFor="confirmPassword" className="formLabel">Confirm Password</label>
                            <input 
                              type="password" 
                              className="formInput" 
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                        </div>
                        <button type="submit" className="btn formBtn">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
