// const express = require('express');
// const app = express();
const crypto = require('crypto');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'Tom',
  host: 'localhost',
  database: 'ecommerce_app',
  password: 'password',
  port: 5432,
});

const getItems = (req, res) => {
  pool.query('SELECT * FROM items ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM items WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const createItem = (req, res) => {
  const { name, price, in_stock, stock_count, manufacturer_id } = req.body;
  console.log(req.body);

  pool.query('INSERT INTO items (name, price, in_stock, stock_count, manufacturer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, price, in_stock, stock_count, manufacturer_id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(`Item added with ID: ${results.rows[0].id}`);
  })
};

const updateItem = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, in_stock, stock_count, manufacturer_id } = req.body;

  pool.query(
    'UPDATE items SET name = $1, price = $2, in_stock = $3, stock_count = $4, manufacturer_id = $5 WHERE id = $6',
    [name, price, in_stock, stock_count, manufacturer_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Item modified with ID: ${id}`);
    }
  )
};

const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('DELETE FROM items WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`ITEM deleted with ID: ${id}`);
  })
};


const addToCart = (req, res) => {
  const itemId = parseInt(req.body.itemId);
  console.log(`itemId: ${itemId}`);
  const itemName = req.body.itemName;
  console.log(`itemName: ${itemName}`);
  const itemPrice = req.body.itemPrice;
  console.log(`itemPrice: ${itemPrice}`);
  var userId = 'temp';

  // if (req.user.id) { userId = req.user.id };

  let count = 0;

  for (let i = 0; i < req.session.cart.length; i++) {
    if(req.session.cart[i].itemId === itemId) {
      req.session.cart[i].quantity += 1;

      count++;
    }
  }

  if (count === 0) {
    const cart_data = {
      itemId: itemId,
      itemName: itemName,
      itemPrice: parseFloat(itemPrice),
      quantity: 1
    };

    req.session.cart.push(cart_data);
  }

  console.log(req.session.cart);

  res.redirect('/'); 
}

const removeFromCart = (req, res) => {
  const itemId = parseInt(req.params.id);

  for (let i = 0; i < req.session.cart.length; i++) {
    if(req.session.cart[i].itemId === itemId) {
      req.session.cart[i].quantity--;
      if(req.session.cart[i].quantity === 0) {
        req.session.cart.splice(i, 1);
      }
    }
  }

  console.log(req.session.cart);

  res.redirect('/');
}

const emptyCart = (req, res) => {
  req.session.cart = [];

  res.redirect('/');
};


const checkout = (req, res) => {
  const payment = true;
  let totalItems = 0;
  let totalCost = 0; 

  for (let i = 0; i < req.session.cart.length; i++) {
    totalItems += 1;
    let costToAdd = req.session.cart[i].itemPrice * req.session.cart[i].quantity;
    totalCost += costToAdd;
  }

  if (totalItems === 0) {
    res.status(400).send(`Cart is empty.`);
  }
  if (payment === false) {
    res.status(400).send(`Payment failed.`);
  }
  pool.query('INSERT INTO orders (date_time, items, total_cost, user_email) VALUES (CURRENT_TIMESTAMP, $1, $2, $3) RETURNING *', [JSON.stringify(req.session.cart), totalCost, req.body.userEmail], (error, results) => {
    if(error) { throw error; }

    res.status(200).send(`Order ${results.rows[0].id} placed successfully`)
  });

  req.session.cart = [];
};

const registerUser = (req, res) => {
  const { username, password } = req.body;

  const genPassword = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
  };

  const hashedPassword = genPassword(password);

  pool.query('INSERT INTO users (username, hashed_password, salt, unhashed) VALUES ($1, $2, $3, $4) RETURNING *', [
    username,
    hashedPassword.hash,
    hashedPassword.salt,
    'password'
  ], (error, results) => {
    if (error) {
      throw error;
    }

    var user = {
      id: results.rows[0].id,
      username: req.body.username
    };
    req.login(user, function(err) {
      if (err) { return (err); }
      console.log('Successfully logged in!');
      res.redirect('/');
      return ;
    });

    res.status(201).send(`User added with username: ${username}`);
  })
};


const getUsers = (req, res) => {
  pool.query('SELECT username FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT username FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { username, hashed_password, salt, unhashed } = req.body;

  pool.query(
    'UPDATE users SET username = $1, hashed_password = $2, salt = $3, unhashed = $4 WHERE id = $5',
    [username, hashed_password, salt, unhashed, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User modified with ID: ${id}`);
    }
  )
};

const getOrders = (req, res) => {
  const { userEmail } = req.body;
  pool.query('SELECT * FROM orders WHERE user_email = $1', [userEmail], (error, results) => {
    if (error) { throw(error); }
    res.status(201).json(results.rows);
  })
};

const getOrderById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};



module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addToCart,
  removeFromCart,
  emptyCart,
  checkout,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  getOrders,
  getOrderById,
  pool
};