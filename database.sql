CREATE DATABASE mydb;

CREATE TABLE users(

    id serial primary key,
    firstname VARCHAR(50),
    lastname  VARCHAR(50),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_on TIMESTAMP NOT NULL

);

CREATE TABLE login(

    login_id serial primary key,
    user_id INT NOT NULL,
    last_login TIMESTAMP NOT NULL, 
    FOREIGN KEY (user_id)
        REFERENCES users (id)
) ;
INSERT INTO users VALUES(1,'heba','khayat','honeydrop','000','1994-11-27');
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
ALTER USER postgres PASSWORD 'poop';
ALTER TABLE users ADD phone_num VARCHAR(50);
INSERT INTO users(id,firstname, lastname, username, password, created_on, phone_num )
    VALUES(1,'heba','khayat','honeydrop','000','1994-11-27',0000);

    ALTER TABLE users
ALTER COLUMN phone_num TYPE VARCHAR(50) ;