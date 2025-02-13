import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCart } from '../cart/cartActions';
import './orderCreated.css';

const OrderCreated = () => {
  const location = useLocation();
  const { orderCart = [], totalPrice } = location.state || { orderCart: [], totalPrice: 0 };

  useEffect(() => {
    clearCart();
  });

  return (
    <div className="orderCreatedContainer">
      <h2>Order Successful!</h2>
      <p>Thank you for your purchase</p>
      <div className="cartSummary">
        <h3>Cart Summary</h3>
        <ul className="cartList-orderComplete">
          {orderCart.map((item, index) => (
            <li key={index} className="orderItem">
              <img src={require(`../../img/${item.imgRef}.jpg`)} alt={item.name} className="cartImg" />
              <div className="itemInfo-orderComplete">
                <h3>{item.itemName}</h3>
                <div className="itemDetails-orderComplete">
                  <p>Price: £{item.itemPrice}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p>Total: £{totalPrice}</p>
      </div>
      <Link to="/" className="btn">Continue Shopping</Link>
    </div>
  );
};

const mapDispatchToProps = { clearCart, };

export default connect(null, mapDispatchToProps)(OrderCreated);