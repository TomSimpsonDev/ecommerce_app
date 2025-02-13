import React from 'react';
import { Link } from 'react-router-dom';
import './item.css';

export default function Item({item}) {
  return (
    <div key={item.id}>
      <Link to={`/items/${item.id}`} className="itemContainer">
        <div className="imgContainer">
            <img src={require(`../../img/${item.img}.jpg`)} alt={item.name} className="itemImg" />
            <p className="itemDesc">{item.description}</p>
        </div>
        <div className="itemText">
            <h2 className="itemTitle">{item.name}</h2>
            <p>£{item.price}</p>
        </div>
      </Link>
    </div>
  )
}
