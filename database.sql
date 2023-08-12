DROP TABLE IF EXISTS conjugations;
DROP TABLE IF EXISTS verbs;

DROP DATABASE IF EXISTS conjugator;

CREATE DATABASE conjugator;

CREATE TABLE verbs (
    id SERIAL PRIMARY KEY,
    infinitive VARCHAR(50) NOT NULL
);

CREATE TABLE conjugations (
    id SERIAL PRIMARY KEY,
    verb_id INT REFERENCES verbs(id),
    subject_pronoun VARCHAR(10) NOT NULL,
    conjugated_form VARCHAR(100) NOT NULL,
    kata VARCHAR(255) NOT NULL
);

