CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone VARCHAR(13),
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    owner VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL
        REFERENCES properties ON DELETE CASCADE,
    guest_username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE images (
    key TEXT NOT NULL PRIMARY KEY,
    property_id INT NOT NULL
        REFERENCES properties ON DELETE CASCADE
);