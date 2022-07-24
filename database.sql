CREATE DATABASE mydb;

CREATE TABLE users(

    id serial primary key,
    firstname VARCHAR(50),
    lastname  VARCHAR(50),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    created_on TIMESTAMP NOT NULL

);

CREATE TABLE vehicles(

    id serial primary key,
    plate_num VARCHAR(50),
    model  VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()

);
INSERT INTO users VALUES(1,'heba','khayat','honeydrop','000','1994-11-27');
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
ALTER USER postgres PASSWORD 'poop';
ALTER TABLE users ADD phone_num VARCHAR(50);
INSERT INTO users(id,firstname, lastname, username, password, created_on, phone_num )
    VALUES(1,'heba','khayat','honeydrop','000','1994-11-27',0000);

    ALTER TABLE users
ALTER COLUMN phone_num TYPE VARCHAR(50) ;
CREATE TABLE drivers(
    id serial primary key,
    firstname VARCHAR(50),
    lastname  VARCHAR(50),
    phone_num VARCHAR(50),
    license_id integer  

);

ALTER TABLE drivers
  RENAME COLUMN license_id TO license_num;

CREATE TABLE clients (
    id serial primary key,
    firstname VARCHAR(50),
    lastname  VARCHAR(50),
    phone_num VARCHAR(50)
);

ALTER TABLE clients
ADD created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 ADD updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE clients 
DROP COLUMN created_at;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE reservations(
    id serial primary key,
    description VARCHAR(250),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    source VARCHAR(250),
    destination VARCHAR(250),
    subject VARCHAR(250),
    price float,
    client_id int,
    vehicle_id int,
    driver_id int,
    user_id int,
    isFullDay boolean,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()


);
INSERT INTO reservations(description, subject, start_time, end_time, source, destination,
                 price, client_id, user_id, driver_id, vehicle_id, isFullDay)
                VALUES('somethin','test','7/24/22 3:00 AM','7/24/22 4:00 AM','tes','test',900,3,83,4,3,false);