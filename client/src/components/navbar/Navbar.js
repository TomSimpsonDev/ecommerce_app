require('dotenv').config();
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { API_ENDPOINT } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated, cart }) => {
  // Check if the user is authenticated for conditional rendering
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch(`${process.env.API_ENDPOINT}/auth/check`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  // Calculate total quantity of items in the cart to display on the cart button
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    const response = await fetch(`${process.env.API_ENDPOINT}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">Stuff'R'Us!!</Link>
      <div className="btnContainer">
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="btn cartBtn">
              <FontAwesomeIcon icon={faCartShopping} />
              {totalQuantity > 0 && <span className="cartQuantity">{totalQuantity}</span>}
            </Link>
            <Link to="/user" className="btn userBtn"><FontAwesomeIcon icon={faUser} /></Link>
            <button onClick={handleLogout} className="btn logoutBtn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn loginBtn">Login</Link>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Navbar);