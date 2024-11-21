-- CREATE TABLE manufacturers (
--   id SERIAL PRIMARY KEY,
--   name varchar
-- );

-- CREATE TABLE items (
--   id SERIAL PRIMARY KEY,
--   name varchar,
--   price float,
--   in_stock boolean,
--   stock_count integer,
--   manufacturer_id integer REFERENCES manufacturers(id)
-- );

-- INSERT INTO manufacturers (name)
-- VALUES 
--   ('Nintendo'),
--   ('Games Workshop'),
--   ('Apple'),
--   ('Riot Games');

-- INSERT INTO items (name, price, in_stock, stock_count, manufacturer_id)
-- VALUES 
--   ('Switch', 249.99, true, 17, 1),
--   ('Pro Controller', 59.99, true, 7, 1),
--   ('Necron Monolith', 79.99, true, 4, 2),
--   ('Dice', 8.99, False, 0, 2),
--   ('iPhone 17 Pro Max XL', 1799.99, true, 1, 3),
--   ('Ezreal skin no. 20837', 100000.99, true, 1000, 4);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  hashed_password TEXT,
  salt TEXT
);

INSERT INTO users (username, hashed_password, salt)
VALUES
  ('me', 'password', '1234'),
  ('you', 'password', '5678');