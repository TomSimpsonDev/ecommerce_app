import React, { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../../api';
import { useNavigate } from 'react-router-dom';
import './user.css';

export default function User() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // check if user is authenticated before fetching orders
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login?message=login_required');
      return;
    }

    const fetchOrders = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await fetch(`${API_ENDPOINT}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
          });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        const parsedOrders = data.map(order => ({   // Parse the JSON string to an object for rendering
          ...order,
          items: JSON.parse(order.items)
        }))
        setOrders(parsedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ordersContainer">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <ul className="orderList">
          {orders.map((order) => (
            <li key={order.id} className="orderItem-user">
              <div className="orderItem-user-header">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.order_status}</p>
              </div>
              <p>Placed on: {new Date(order.date_time).toLocaleString()}</p>
              <ul>
                {Array.isArray(order.items) ? (
                  order.items.map((item, index) => (
                  <li key={index}>
                    <p>{item.itemName} - Quantity: {item.quantity}</p>
                  </li>
                ))
                ) : (
                  <li>No items found for this order.</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}