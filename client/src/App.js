import './App.css';
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from './components/home/Home';
import User from './components/user/User';
import { Checkout } from './components/checkout/Checkout';
import Login from './components/login/Login';
import Navbar from './components/navbar/Navbar';
import Signup from './components/signup/Signup';
import ItemDetail from './components/itemDetail/ItemDetail';
import Cart from './components/cart/Cart';
import OrderCreated from './components/orderCreated/OrderCreated';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated}
      />
      
      <div className="container routeContainer">
        <Routes>
          <Route path='/' element={ <Home/> } />
          <Route path='user' element={ <User/> } />
          <Route path='checkout' element={ <Checkout/> } />
          <Route path='order-created' element={ <OrderCreated/> } />
          <Route 
            path='login' 
            element={ <Login setIsAuthenticated={setIsAuthenticated}/> }
          />
          <Route path='signup' element={ <Signup/> } />
          <Route path='items/:id' element={ <ItemDetail/> } />
          <Route path='cart' element={ <Cart/> } />
        </Routes>
      </div>
    </div>
  );
}

