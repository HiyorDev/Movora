DROP TABLE IF EXISTS "user";

CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       username VARCHAR(45) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL
);