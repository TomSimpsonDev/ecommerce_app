require('dotenv').config();
import React, { useEffect, useState } from 'react';
// import { API_ENDPOINT } from '../../api';
import './itemList.css';
import Item from '../item/Item';

export default function ItemList() {
  const [items, setItems] = useState([]);

  // Fetch items from the server
  useEffect(() => {
    fetch(`${process.env.API_ENDPOINT}/items`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setItems(data.items);
      })
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <div className="itemList">
        {items.map(item => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}