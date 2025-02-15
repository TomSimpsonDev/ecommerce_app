require('dotenv').config();
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { addItemToCart, removeFromCart } from '../cart/cartActions';
// import { API_ENDPOINT } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import DOMPURIFY from 'dompurify';
import descriptions from './itemDetailDescriptions.json';
import './itemDetail.css';

const ItemDetail = ({ cart, addItemToCart, removeFromCart }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if the user is authenticated before allowing cart interaction
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login?message=login_required');
    } else {
      handleAddToCart();
    }
  };

  const handleRemoveFromCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login?message=login_required');
    } else {
      handleRemoveFromCart(item.id);
    }
  };

  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  // Fetch the item data
  useEffect(() => {
    const fetchItem = async () => {
        try {
            const response = await fetch(`${process.env.API_ENDPOINT}/items/${id}`, {
              method: 'GET',
              credentials: 'include',
            });
    
            if (!response.ok) {
              throw new Error(`Failed to fetch item: ${response.statusText}`);
            }
    
            const data = await response.json();
            setItem(data[0]);
          } catch (err) {
            console.error('Error fetching item:', err);
            setError(err.message);
          }
    };

    fetchItem();
  }, [id, item]);

  const handleAddToCart = () => {
    addItemToCart(item);
  }

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Loading...</div>;
  }

  // Load the item image
  const itemImg = require(`../../img/${item.img}.jpg`);

  // Sanitize the item description
  const sanitizedDescription = DOMPURIFY.sanitize(descriptions[item.img]);

  // Find the item in the cart and get its quantity
  const cartItem = cart.find(cartItem => cartItem.id === item.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="item-detail">
        <div className="leftGrid">
            <img src={itemImg} alt={item.name} className="itemImg-detail" />
            <div className="itemControls">
              <p className="itemPrice-detail">£{item.price}</p>
              <div className="cartQuantity-detail">
                <p>{itemQuantity} in cart</p>
                <div className="cartBtns">
                    {item.in_stock && itemQuantity > 0 ? (
                      <div className="detailBtnContainer">
                        <button className="addToCart detailBtn btn" onClick={handleAddToCartClick}><FontAwesomeIcon icon={faPlus} /></button>
                        <button className="removeFromCart detailBtn btn" onClick={() => handleRemoveFromCartClick(item.id)}><FontAwesomeIcon icon={faMinus} /></button>
                      </div>
                    ) : (item.in_stock ? (
                      <div className="detailBtnContainer">
                        <button className="addToCart detailBtn btn" onClick={handleAddToCartClick}><FontAwesomeIcon icon={faPlus} /></button>
                        <button className="removeFromCart detailBtn btn deactivated" onClick={() => handleRemoveFromCartClick(item.id)}><FontAwesomeIcon icon={faMinus} /></button>
                      </div>                        
                      )
                        : (
                          <button className="outOfStock">Out of Stock</button>
                        )
                      )
                    }  
                </div>
              </div>
            </div>
        </div>
        <div className="itemText-detail rightGrid">
            <h1>{item.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} className="itemDesc-detail"/>
        </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
});

const mapDispatchToProps = {
  addItemToCart,
  removeFromCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);