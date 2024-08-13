const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db.js");
const { auth } = require("./middleware.js");

function validateRegister(req, res, next) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({
      message: "Expecting the following fields: email, password, name",
    });
    return;
  }
  const errors = [];
  if (email.length == 0) errors.push("Email harus diisi");
  else if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  )
    errors.push("Format email tidak sesuai");

  if (password.length < 8)
    errors.push("Password harus terdiri dari minimal 8 karakter");

  if (name.length < 5)
    errors.push("Nama harus terdiri dari minimal 5 karakter");
  else if (!name.match(/^[a-zA-Z0-9]+$/))
    errors.push(
      "Nama hanya boleh terdiri dari huruf alfabet dan angka 0-9 saja"
    );

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(". ") });
    return;
  } else {
    next();
  }
}

function createUserObject(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

router.post("/register", validateRegister, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { lastID } = await db.run(
      "INSERT INTO accounts (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name]
    );

    const user = await db.get("SELECT * FROM accounts WHERE id = ?", [lastID]);
    // set user property on session object if login is successful
    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.status(201).json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // get user from the database by their email
    const user = await db.get("SELECT * FROM accounts WHERE email = ?", [
      email,
    ]);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Email or password is incorrect!" });
      return;
    }
    // set user property on session object if login is successful
    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.status(200).json(createUserObject(user));
  } catch (err) {
    next(err);
  }
});

router.post("/logout", auth, (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

router.get("/me", (req, res) => {
  if (req.session.user) res.status(200).json(req.session.user);
  else res.status(401).end();
});

router.get("/", auth, async (req, res) => {
  const user = await db.get("SELECT * FROM accounts WHERE id = ?", [
    req.session.user.id,
  ]);
  if (!user) {
    res
      .status(404)
      .json({ message: `Cannot find account with ID ${req.session.user.id}` });
  } else {
    res.status(200).json(createUserObject(user));
  }
});

module.exports = router;
