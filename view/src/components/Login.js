import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../../../db/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  const Navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password', password);
    console.log('Form submitted');
    console.log('API_ENDPOINT:', API_ENDPOINT);

    const response = await fetch(`${API_ENDPOINT}/login/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      console.log('Login successful');
      Navigate('/');
    } else {
      // Handle error response
      console.error('Login failed');
      setLoginFailed(true);
    }
  };

  return (
    <div>
      <div className='container login'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              className='form-control'
              id='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              className='form-control'
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
        <div className="loginFailed">
            {loginFailed && <p>Login failed. Please try again.</p>}
        </div>
      </div>
      <h3>Don't have an account? <Link to="/signup" className="link signupLink">Sign Up</Link></h3>
    </div>
  );
}