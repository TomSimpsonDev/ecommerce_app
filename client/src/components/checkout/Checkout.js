import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../cart/cartActions';
import './checkout.css';

const stripePromise = loadStripe('pk_test_51QpA9aG49dDz6Ymvne7Eg9QHo0YuGWlubdtVuzmmw3p6jHxtg5RenkX3OEgLBKKUAPF0dPpqPzs5twCkvGuXMVCU00hvObQDJa');

const CheckoutForm = ({ cart, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Load user email from session storage
  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  // Check if all required fields are filled
  useEffect(() => {
    if (email && name && address1 && city && postCode && country) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, name, address1, city, postCode, country]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if stripe and elements are loaded
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    // Handle payment method creation 
    if (error) {
      setError(error.message);
    } else {  
      setError('');
      const amountInCents = Math.round(totalPrice * 100);
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentMethodId: paymentMethod.id,
          amount: amountInCents,
         }),
      });

      const paymentIntent = await response.json();

      // Handle payment intent creation
      if (paymentIntent.error) {
        setError(paymentIntent.error);
      } else {  
        setSuccess('Payment successful!');

        // Save order to database
        const dbCart = cart.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          quantity: item.quantity,
          imgRef: item.img,
        }));
        const jsonCart = JSON.stringify(dbCart);

        const userId = sessionStorage.getItem('userId');

        const response = await fetch('/cart/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            user_email: email,
            items: jsonCart,
            total_cost: totalPrice,
          }),
        });

        const order = await response.json();

        // Clear cart and navigate to order created page
        if (order.error) {
          setError(order.error);
        } else {  
          dispatch(clearCart());
          navigate('/order-created', { state: { orderCart: dbCart, totalPrice } });
        }
      }
    }
  };

  // Render checkout form
  return (
    <form onSubmit={handleSubmit} className="checkoutForm">
      <div className="formFields">
        <div className="formField">
          <label className="formLabel" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="formInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="formInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="address1">Address Line 1</label>
          <input
            type="address1"
            id="address1"
            className="formInput"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="address2">Address Line 2</label>
          <input
            type="address2"
            id="address2"
            className="formInput"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="city">City</label>
          <input
            type="city"
            id="city"
            className="formInput"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="postCode">Post Code</label>
          <input
            type="postCode"
            id="postCode"
            className="formInput"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel" htmlFor="country">Country</label>
          <input
            type="country"
            id="country"
            className="formInput"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="formField">
          <label className="formLabel">Card Details</label>
          <CardElement className="formInput" />
        </div>
      </div>
      {error && <div className="errorMessage">{error}</div>}
      {success ? (<div className="successMessage">{success}</div>) : <button type="submit" className="btn checkoutBtn" disabled={!stripe || !isFormValid}>Pay £{totalPrice}</button>}
    </form>
  );
};

export default CheckoutForm;

export function Checkout() {
  const location = useLocation();
  const { cart = [], totalPrice } = location.state || { cart: [], totalPrice: 0 };

  return (
    <Elements stripe={stripePromise}>
      <h2 className='checkoutTitle'>Checkout</h2>
      <div className="checkoutContainer">
        <CheckoutForm totalPrice={totalPrice} cart={cart} />
        <div className="checkoutSummary">
          <h3>Cart Summary</h3>
          <ul className="checkoutList">
            {cart.map((item, index) => (
              <li key={index} className="checkoutItem">
                <img src={require(`../../img/${item.img}.jpg`)} alt={item.name} className="checkoutImg" />
                <div className="itemInfo-checkout">
                  <h3>{item.name}</h3>
                  <div className="itemDetails-checkout">
                    <p>Price: £{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="checkoutTotal">Total: £{totalPrice}</p>
        </div>
      </div>
    </Elements>
  );
}