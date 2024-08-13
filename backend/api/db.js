const express = require("express");

const { SQLitePromise } = require("./SQLitePromise");
const router = express.Router();

async function main(db) {
  await db.run(
    "CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, name TEXT NOT NULL)"
  );
  await db.run(
    "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author_id INT NOT NULL, description TEXT NOT NULL, book_file TEXT NOT NULL, thumbnail_file TEXT NOT NULL, FOREIGN KEY (author_id) REFERENCES accounts (id) ON UPDATE CASCADE ON DELETE CASCADE)"
  );
  await db.run(
    "CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER NOT NULL, book_id INTEGER NOT NULL, comment TEXT NOT NULL, time TEXT NOT NULL, FOREIGN KEY (account_id) REFERENCES accounts (id) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (book_id) REFERENCES books (id) ON UPDATE CASCADE ON DELETE CASCADE)"
  );
}

const db = new SQLitePromise("./backend.db");
main(db);

module.exports = db;
