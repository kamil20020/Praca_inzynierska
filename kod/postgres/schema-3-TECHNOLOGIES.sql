CREATE TABLE IF NOT EXISTS TECHNOLOGIES (
    technology_id SERIAL NOT NULL PRIMARY KEY,
    technology_category_id INT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    creation_date_time TIMESTAMP NOT NULL,
    modification_date_time TIMESTAMP NOT NULL,
    provider VARCHAR(50),
    icon bytea,
    first_release_date_time TIMESTAMP,
    last_release_date_time TIMESTAMP,
    CONSTRAINT fk_technology_category
        FOREIGN KEY (technology_category_id)
        REFERENCES TECHNOLOGY_CATEGORIES (technology_category_id)
);