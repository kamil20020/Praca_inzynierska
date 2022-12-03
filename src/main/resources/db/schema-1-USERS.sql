CREATE TABLE IF NOT EXISTS USERS (
    user_id SERIAL NOT NULL PRIMARY KEY,
    user_account_id VARCHAR(36) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    firstname VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email VARCHAR(80) NOT NULL,
    avatar bytea,
    is_reviewer BOOLEAN NOT NULL DEFAULT FALSE
);