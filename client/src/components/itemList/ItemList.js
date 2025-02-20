import React, { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../../api';
import './itemList.css';
import Item from '../item/Item';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch items from the server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/items`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        console.log('data:', data);
        setItems(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching items: {error}</div>;
  }

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