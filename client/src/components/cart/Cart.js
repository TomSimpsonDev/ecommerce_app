import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemToCart, removeFromCart, clearCart } from './cartActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './cart.css';

const Cart = ({ cart, addItemToCart, removeFromCart, clearCart }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleAddToCart = (item) => {
    addItemToCart(item);
  }

  const handleClearCart = () => {
    clearCart();
  }

  useEffect(() => {
    // Calculate total price and round to 2 decimal places
    const newTotalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    setTotalPrice(newTotalPrice);
  }, [cart]);

  
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="cartList">
            {cart.map((item, index) => {
              // Find the item in the cart and get its quantity
              const cartItem = cart.find(cartItem => cartItem.id === item.id);
              const itemQuantity = cartItem ? cartItem.quantity : 0;

              return (
              <li key={index} className="cartItem">
                <Link to={`/items/${item.id}`}>
                  <img src={require(`../../img/${item.img}.jpg`)} alt={item.name} className="cartImg" />
                </Link>
                <div className="itemInfo-cart">
                  <h3>{item.name}</h3>
                  <p>Price: £{item.price}</p>
                </div>
                <div className="itemQuantity-cart">
                  <p>Quantity: {itemQuantity}</p>
                  <div className="cartBtns-cart">
                    <button onClick={() => handleAddToCart(item)} className="btn detailBtn"><FontAwesomeIcon icon={faPlus} /></button>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="btn detailBtn"><FontAwesomeIcon icon={faMinus} /></button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
          <div className="checkoutBtns">
            <button className="btn" onClick={handleClearCart}>Empty Cart</button>
            <p>Total: £{totalPrice}</p>
            <Link to="/checkout"
            state={{
              cart: cart,
              totalPrice
            }} className="btn">Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.cart,
});

const mapDispatchToProps = {
  removeFromCart,
  addItemToCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);