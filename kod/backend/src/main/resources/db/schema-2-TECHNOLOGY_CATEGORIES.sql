CREATE TABLE IF NOT EXISTS TECHNOLOGY_CATEGORIES (
    technology_category_id SERIAL NOT NULL PRIMARY KEY,
    parent_technology_category_id INT,
    name VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT fk_parent_technology_category
        FOREIGN KEY (technology_category_id)
        REFERENCES TECHNOLOGY_CATEGORIES (technology_category_id)
);