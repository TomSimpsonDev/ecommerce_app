require('dotenv').config();
const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const db = require('../db/index');
const pool = db.pool;
const router = express.Router();


passport.use(new LocalStrategy((email, password, done) => {
  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) return done(err);
    if (result.rows.length === 0) return done(null, false, { message: 'Incorrect email or password.' });
    
    const user = result.rows[0];
    const hashedPassword = (password) => {
      const salt = user.salt.toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      return hash;
    };

    if (hashedPassword(password) != user.hashed_password) return done(null, false, { message: 'Incorrect email or password.' });
    return done(null, user);
  });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_ENDPOINT}/auth/google/callback` || "http://localhost:8000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *',
        [profile.id, profile.emails[0].value, profile.displayName]
      );
      return done(null, newUser.rows[0]);
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: `${process.env.API_ENDPOINT}/auth/twitter/callback` || "http://localhost:8000/auth/twitter/callback",
  includeEmail: true // Request email from Twitter
},
async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email associated with this Twitter account'));
    }

    const user = await pool.query('SELECT * FROM users WHERE twitter_id = $1', [profile.id]);
    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (twitter_id, email, name) VALUES ($1, $2, $3) RETURNING *',
        [profile.id, profile.emails[0].value, profile.displayName]
      );
      return done(null, newUser.rows[0]);
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log(`User ${user.id} serialized`);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
    if (err) return done(err);
    done(null, result.rows[0]);
  });
});

router.post("/login",
  passport.authenticate('local'), 
  (req, res) => {
    res.status(200).send({ 
      message: 'Login successful',
      userId: req.user.id
    });
  }
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.API_ENDPOINT || 'http://localhost:3000');
  }
);

router.get('/twitter',
  passport.authenticate('twitter')
);

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.API_ENDPOINT || 'http://localhost:3000');
  }
);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return (err); }
    console.log('Successfully logged out!');
    res.redirect("/");
  });
});

router.post('/signup', db.registerUser);

// Check if user is authenticated, mainly used for conditional rendering in the client
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ authenticated: true });
  } else {
    res.status(401).send({ authenticated: false });
  }
});

module.exports = router;