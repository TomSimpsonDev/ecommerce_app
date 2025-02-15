require('dotenv').config();
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { API_ENDPOINT } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faTwitter as faXTwitter } from '@fortawesome/free-brands-svg-icons';
import './login.css';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const { setIsAuthenticated } = props;

  const Navigate = useNavigate();

  const location = useLocation();
  const [message, setMessage] = useState('');

  // Check if the user was redirected from the signup page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const messageParam = queryParams.get('message');
    if (messageParam === 'signup_success') {
      setMessage('Signup successful. Please login.');
    }
  }, [location]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const messageParam = queryParams.get('message');
    if (messageParam === 'login_required') {
      setMessage('You must be logged in to do that!');
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${process.env.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        username: email, 
        password: password
      }),
    });

    // Handle successful login
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful');
      sessionStorage.setItem('userEmail', email);         // Save details to session for later authentication and user details
      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('isAuthenticated', true);
      setIsAuthenticated(true);
      Navigate('/');
    } else {
      // Handle error response
      console.error('Login failed');
      setLoginFailed(true);
    }
  };

  return (
    <div className="formContainer">
      <h1>Login</h1>
      <div className='formContainer-login'>
        {message && message === "Signup successful. Please login." ? <p className="successMessage">{message}</p> : <p className="errorMessage">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className='formField formField-email'>
            <label htmlFor='email' className="formLabel">Email</label>
            <input
              type='email'
              className='formInput formInput-email'
              id='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='formField formField-password'>
            <label htmlFor='password' className="formLabel">Password</label>
            <input
              type='password'
              className='formInput formInput-password'
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-primary formButton'>Submit</button>
        </form>
        <div className='thirdPartyLogin'>
          <h5>Or login with:</h5>
          <a href={`${process.env.API_ENDPOINT}/auth/google`} className='btn btn-danger'><FontAwesomeIcon icon={faGoogle} /></a>
          <a href={`${process.env.API_ENDPOINT}/auth/twitter`} className='btn btn-info'><FontAwesomeIcon icon={faXTwitter} />
          </a>
        </div>
        <div className="loginFailed">
            {loginFailed && <p>Login failed. Please try again.</p>}
        </div>
      </div>
      <h5>Don't have an account? <Link to='/signup' className='signUpLink'>Sign Up!</Link></h5>
    </div>
  );
}