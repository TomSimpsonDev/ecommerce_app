const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/index');
const port = 3000;

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// app.use((req, res, next) => {
//   db.setCartID();
//   next();
// });

app.get('/', (req, res) => {
  const query = 'SELECT * FROM items ORDER BY id ASC';

  db.pool.query(query, (error, result) => {

		if(!req.session.cart)
		{
			req.session.cart = [];
		}

    res.status(200).send('Cart created successfully');

		// res.render('items', { items : result, cart : req.session.cart });
	});
});

app.get('/items', db.getItems);
app.get('/items/:id', db.getItemById);
app.post('/items', db.createItem);
app.put('/items/:id', db.updateItem);
app.delete('/items/:id', db.deleteItem);

app.post('/cart/', db.addToCart);
app.delete('/cart/:id', db.removeFromCart);
app.delete('/cart', db.emptyCart);

app.post('/cart/checkout/', db.checkout);

app.use(passport.authenticate('session'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.put('/users/:id', db.updateUser);

app.get('/orders', db.getOrders);
app.get('/orders/:id', db.getOrderById);

passport.use(new LocalStrategy((username, password, done) => {
  db.pool.query('SELECT * FROM users WHERE username = $1', [username], (err, user) => {
    const hashedPassword = (password) => {
      const salt = user.rows[0].salt.toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return hash;
    };

    if (err) return done(err);
    if (!user) return done(null, false);
    if (hashedPassword(password) != user.rows[0].hashed_password) return done(null, false);
    return done(null, user.rows[0]);
  });
}));

passport.serializeUser((user, done) => {
  console.log(`User ${user.id} serialized`);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.pool.query('SELECT * FROM users WHERE id = $1', [id], (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

app.post("/login",
  passport.authenticate('local', { failureRedirect : "/login"}),
  (req, res) => {
    console.log('Login successful');
    // res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return (err); }
    // res.redirect("/");
  });
});

app.post('/register', db.registerUser);


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});