DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	mobile_number integer,
	profile_picture VARCHAR(255),

	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    price integer NOT NULL,
    category VARCHAR(255),
    is_postage BOOLEAN DEFAULT false,
    is_meet_up BOOLEAN DEFAULT false,
    meet_up_location VARCHAR(255),
    is_brand_new BOOLEAN DEFAULT false, 
    is_used BOOLEAN DEFAULT false, 
    is_reserved BOOLEAN DEFAULT false, 
	is_sold BOOLEAN DEFAULT false, 
	is_deleted BOOLEAN DEFAULT false,
    user_id integer,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id)
   
);
CREATE TABLE offers (
	id SERIAL PRIMARY KEY,
	offer_price integer,
	is_accepted BOOLEAN DEFAULT false, 
	is_declined BOOLEAN DEFAULT false,

	listing_id integer,
	user_id integer,

	FOREIGN KEY (listing_id) REFERENCES listings(id),
	FOREIGN KEY (user_id) REFERENCES users(id),

	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()

);
CREATE TABLE transactions (
	id SERIAL PRIMARY KEY,
	transaction_price integer,
	offer_id integer,
	listing_id integer,
	user_id integer,

	FOREIGN KEY (listing_id) REFERENCES listings(id),
	FOREIGN KEY (offer_id) REFERENCES offers(id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()

);


CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    listing_id integer,
    user_id integer,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);




CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
	content TEXT,
	rating integer,
	transaction_id integer,
	review_owner_id integer,
	review_target_id integer,

	FOREIGN KEY (transaction_id) REFERENCES transactions(id),
	FOREIGN KEY (review_owner_id) REFERENCES users(id),
	FOREIGN KEY (review_target_id) REFERENCES users(id),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()

);



CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	content TEXT,
	to_user_id integer,
	from_user_id integer,
	listing_id integer,
	is_read BOOLEAN,

	FOREIGN KEY (to_user_id) REFERENCES users(id),
	FOREIGN KEY (from_user_id) REFERENCES users(id),
	FOREIGN KEY (listing_id) REFERENCES listings(id),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()

);




