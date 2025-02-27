// const express = require('express');
// const app = express();

require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");
const crypto = require('crypto');
const Pool = require('pg').Pool;

// Use Neon database URL from environment variables
const sql = neon(process.env.DATABASE_URL);

const pool = new Pool({
  // user: 'tomsimpson',
  // host: 'localhost',
  // database: 'ecommerce_app',
  // password: 'password',
  // port: 5433,

  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const requestHandler = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (error) {
    console.error('Error executing query', error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("An error occurred");
  }
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

const getItems = (callback) => {
  pool.query('SELECT * FROM items ORDER BY name ASC', (error, results) => {
    if (error) {
      console.error('Error fetching items:', error);
      callback([]);
      return;
    }
    console.log(results.rows);
    callback(null, results.rows);
  })
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);

  // verify that the ID is a number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  pool.query('SELECT * FROM items WHERE id = $1', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(results.rows);
  })
};

// for use as a developer but not yet implemented in the client
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

// for use as a developer but not yet implemented in the client
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

// for use as a developer but not yet implemented in the client
const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('DELETE FROM items WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`ITEM deleted with ID: ${id}`);
  })
};

const createOrder = (req, res) => {
  const { user_id, user_email, items, total_cost } = req.body;
  const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

  pool.query('INSERT INTO orders (user_id, user_email, items, total_cost, date_time, order_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user_id, user_email, items, total_cost, date_time, 'Pending'], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).json(results.rows);
  })
};

const registerUser = (req, res) => {
  const { email, password } = req.body;

  const genPassword = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
  };

  const hashedPassword = genPassword(password);

  pool.query('INSERT INTO users (email, hashed_password, salt, unhashed) VALUES ($1, $2, $3, $4) RETURNING *', [
    email,
    hashedPassword.hash,
    hashedPassword.salt,
    'password'
  ], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    const user = {
      id: results.rows[0].id,
      email: req.body.email
    };

    res.status(201).json({ message: 'Signup successful', user });
  })
};

// for use as a developer but not yet implemented in the client
const getUsers = (req, res) => {
  pool.query('SELECT email FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT email FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

// for use by user but not yet implemented in the client
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { email, hashed_password, salt, unhashed } = req.body;

  pool.query(
    'UPDATE users SET email = $1, hashed_password = $2, salt = $3, unhashed = $4 WHERE id = $5',
    [email, hashed_password, salt, unhashed, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`User modified with ID: ${id}`);
    }
  )
};

const getOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// for use by user but not yet implemented in the client
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
  createOrder,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  getOrders,
  getOrderById,
  pool
};
