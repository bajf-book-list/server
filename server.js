'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/books', function(request, response) {
  client.query('SELECT * FROM books;')
  .then(function(data) {
    response.send(data);
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.post('/api/v1/books', function(request, response) {
  client.query(`
    INSERT INTO books(title, author, image_url, isbn, description)
    VALUES($1, $2, $3, $4, $5);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.image_url,
      request.body.isbn,
      request.body.description,

    ]
  )
  .then(function(data) {
    response.redirect('/');
  })
  .catch(function(err) {
    console.error(err);
  });
});

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(256),
      author VARCHAR(256),
      image_url VARCHAR(256),
      isbn VARCHAR(30),
      description VARCHAR(256)
    );`
  )
  .then(function(response) {
    console.log('created table in db!!!!');
  });
};
