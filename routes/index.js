const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../db/index');

const app = express.Router();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})
);

app.get('/items', (req, res) => {
  db.getItems((error, items) => {
    if (error) {
      return res.status(500).send('Error fetching items');
    }

    res.json({ items: items });
  });
});

app.get('/items', db.getItems);
app.get('/items/:id', db.getItemById);
app.post('/items', db.createItem);
app.put('/items/:id', db.updateItem);
app.delete('/items/:id', db.deleteItem);

app.post('/cart/checkout/', db.createOrder);

app.use(passport.authenticate('session'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.put('/users/:id', db.updateUser);

app.post('/orders', db.getOrders);
app.get('/orders/:id', db.getOrderById);

module.exports = app;