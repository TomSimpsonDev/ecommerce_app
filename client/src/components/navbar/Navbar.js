import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_ENDPOINT } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated, cart }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if the user is authenticated for conditional rendering
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch(`${API_ENDPOINT}/auth/check`, {
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  // Calculate total quantity of items in the cart to display on the cart button
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    const response = await fetch(`${API_ENDPOINT}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setIsAuthenticated(false);
    }
  };

  const mobileLogout = () => {
    handleLogout();
    toggleMenu();
  }

  return (
    <div className="navbar">
      <Link to="/" className="logo">Stuff'R'Us!!</Link>
      {isAuthenticated ? (
        <div className="btnContainer">
          <div className="wideScreenButtons">
            <Link to="/cart" className="btn cartBtn">
              <FontAwesomeIcon icon={faCartShopping} />
              {totalQuantity > 0 && <span className="cartQuantity">{totalQuantity}</span>}
            </Link>
            <Link to="/user" className="btn userBtn"><FontAwesomeIcon icon={faUser} /></Link>
            <button onClick={handleLogout} className="btn logoutBtn">Logout</button>
          </div>
          <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      ) : (
        <div className="btnContainer">
          <Link to="/login" className="btn loginBtn">Login</Link>
        </div>
      )}
      <div className={`hamburger-links ${isOpen ? 'open' : ''}`}>
        <Link to="/cart" onClick={toggleMenu} className="burgerLink">Cart</Link>
        <Link to="/user" onClick={toggleMenu} className="burgerLink">User</Link>
        <button onClick={mobileLogout} className="burgerLink">Logout</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Navbar);