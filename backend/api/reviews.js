const express = require("express");
const router = express.Router();
const db = require("./db.js");
const {auth, idParam} = require("./middleware");
const {dispatch} = require("./io.js");

function createReviewObject(row){
	return {
		id: row.id,
		user: {
			id: row.account_id,
			name: row.account_name
		},
		comment: row.comment,
		time: row.time,
	}
}

async function thisIsMyReview(req, res, next){
	if (!req.params.id){
		next();
		return;
	}
	
	const review = await db.get(QUERY + " WHERE reviews.id = ?", req.params.id);
	if (!review) {
		res.status(404).send({message: "Review tidak ditemukan"});
	} else if (review.account_id !== req.session.user.id) {
		res.status(401).send({message: "Anda tidak berhak menghapus komentar ini"});
	} else {
		next();
	}
}

const QUERY = "SELECT reviews.*, accounts.id AS account_id, accounts.name AS account_name FROM reviews JOIN accounts ON accounts.id = reviews.account_id"
router.get("/:id", idParam, async (req, res, next) => {
	// id merupakan book_id
	const { id } = req.params;
	try {
		const reviews = await db.all(QUERY + " WHERE book_id = ? ORDER BY time DESC", [id]);
		res.status(200).send(reviews.map(x => createReviewObject(x)));
	} catch (err){
		next(err);
	}
});

router.post("/:id", auth, idParam, async (req, res, next) => {
	const { id } = req.params;
	const { comment } = req.body;
	
	try {
		const result = await db.run(
			"INSERT INTO reviews (book_id, account_id, comment, time) VALUES (?,?,?,?)",
			[id, req.session.user.id, comment, new Date().toISOString()]
		);
	
		const review = await db.get(QUERY + " WHERE reviews.id = ?", [result.lastID]);
		res.status(201).end();

		dispatch((io) => {
		  	io.to("book-" + id.toString()).emit("newReview", createReviewObject(review));
		});
	} catch (err){
		next(err);
	}
});

router.delete("/:id", auth, idParam, thisIsMyReview, async (req, res, next) => {
	// id merupakan id dari review
	const { id } = req.params;
	try {
		const { book_id } = await db.get("SELECT book_id FROM reviews WHERE id = ?", [id]);
		await db.run("DELETE FROM reviews WHERE id = ?", id);
		res.status(200).end();
		dispatch((io) => {
			io.to("book-" + book_id.toString()).emit("deleteReview", id, req.session.user.id);
		});
	} catch (err){
		next(err);
	}
});

module.exports = router;
