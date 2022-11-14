CREATE TABLE IF NOT EXISTS ARTICLE_VERIFICATIONS (
    article_verification_id SERIAL NOT NULL PRIMARY KEY,
    article_id CHAR(24) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL,
    verification_feedback TEXT,
    assignment_date TIMESTAMP NOT NULL,
    author_id INT NOT NULL REFERENCES USERS (user_id)
);