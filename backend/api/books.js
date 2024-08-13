const express = require("express");
const router = express.Router();
const db = require("./db.js");
const { auth, idParam } = require("./middleware.js");
const fs = require("fs");

const upload = require("./upload.js");
const { dispatch } = require("./io.js");

function fsUnlink(path){
	return new Promise((resolve, reject)=>{
		fs.unlink(path, (err)=>{
			if (err) reject(err);
			else resolve();
		});
	});
}

function createBookObject(row){
	return {
		id: row.id,
		title: row.title,
		author: {
			name: row.author_name,
			id: row.author_id,
		},
		desc: row.description,
		filename: row.book_file,
		img: row.thumbnail_file,
	}
}

async function thisIsMyBook(req, res, next){
	if (!req.params.id){
		next();
		return;
	}
	const book = await db.get(QUERY + " WHERE books.id = ?", req.params.id);
	if (!book) {
		res.status(404).json({message: "Buku tidak ditemukan"});
		return;
	} else if (book.author_id !== req.session.user.id) {
		res.status(401).json({message: "Anda bukan author dari buku ini"});
		return;
	} else {
		next();
	}
}

const QUERY = "SELECT books.*, accounts.name AS author_name FROM books JOIN accounts ON accounts.id = books.author_id";

router.get("/", async (req, res, next) => {
	try {
		const books = await db.all(QUERY);
		res.status(200).send(books.map(x => createBookObject(x)));
	} catch (err) {
		next(err);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const book = await db.get(QUERY + " WHERE books.id = ?", id);
		if (!book) {
			res.status(404).send({message: "Buku tidak ditemukan"});
		} else {
			res.status(200).send(createBookObject(book));
		}
	} catch (err) {
		next(err);
	}
});

router.post("/", auth, upload.fields([
	{name: "img", maxCount: 1},
	{name: "file", maxCount: 1}
]), async (req, res) => {
try {
	const { img, file } = req.files;
	const { title, desc } = req.body
	const author = req.session.user.id;
	const result = await db.run(
		"INSERT INTO books (title, author_id, description, book_file, thumbnail_file) VALUES (?,?,?,?,?)",
		[
			title,
			author,
			desc,
			file[0].filename,
			img[0].filename
		]
	);

	const book = createBookObject(await db.get(QUERY + " WHERE books.id = ?", [result.lastID]));
	res.status(200).json(book);
	
	dispatch(io => io.emit("editBook", book, req.session.user.id));
} catch (err) {
	console.error(err);
	res.status(500).send("Failed to add book");
}
});

router.put("/:id", auth, idParam, thisIsMyBook, upload.fields([
	{name: "img", maxCount: 1},
	{name: "file", maxCount: 1}
]), async (req, res, next) => {
	try {
		const { id } = req.params;
		const { img, file } = req.files;
		const { title, desc } = req.body

		const setters = [];
		const params = [];

		if (title){
			setters.push("title = ?");
			params.push(title);
		}
		if (desc){
			setters.push("description = ?");
			params.push(desc);
		}
		if (file && file.length > 0){
			setters.push("book_file = ?");
			params.push(file[0].filename);
		}
		if (img && img.length > 0){
			setters.push("thumbnail_file = ?");
			params.push(img[0].filename);
		}

		if (setters.length == 0){
			res.status(200).end();
			return;
		}

		const oldBook = createBookObject(await db.get(QUERY + " WHERE books.id = ?", [id]));

		await db.run("UPDATE books SET " + setters.join(', ') + " WHERE books.id = ?", [...params, id]);
		const newBook = createBookObject(await db.get(QUERY + " WHERE books.id = ?", [id]));

		res.status(200).json(newBook);
		dispatch(io => io.emit("editBook", newBook, req.session.user.id));

		// cleanup old images
		const promises = [];
		if (img && img.length > 0) promises.push(fsUnlink('./storage/' + oldBook.img));
		if (file && file.length > 0) promises.push(fsUnlink('./storage/' + oldBook.filename))

		await Promise.allSettled(promises);
		
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", auth, idParam, thisIsMyBook, async (req, res, next) => {
	try {
		const { id } = req.params;
		const oldBook = createBookObject(await db.get(QUERY + " WHERE books.id = ?", [id]));
		await db.run("DELETE FROM books WHERE id = ?", [id]);
		res.status(200).end();
		dispatch(io => io.emit("deleteBook", id, req.session.user.id));

		// cleanup old images
		await Promise.allSettled([
			fsUnlink('./storage/' + oldBook.img),
			fsUnlink('./storage/' + oldBook.filename)
		]);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
