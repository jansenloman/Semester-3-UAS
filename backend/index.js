const express = require("express");
const app = express();

const session = require("express-session");
const cors = require("cors");
const SQLiteStore = require("connect-sqlite3")(session);

const AccountRouter = require("./api/account.js");
const BooksRouter = require("./api/books.js");
const ReviewRouter = require("./api/reviews.js");
const {initialize} = require("./api/io.js");

const fs = require("fs");

const PORT = 3000;
const WHITELISTED_URL = "http://localhost:5173";

app.use(cors({
	origin: WHITELISTED_URL,
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
	store: new SQLiteStore,
	secret: "yoursecretkey",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 24 * 3600 * 1000,
		secure: false,
		path: "/",
		sameSite: "lax",
		httpOnly: true,
	},
});
app.use(sessionMiddleware);

app.use("/api/accounts", AccountRouter);
app.use("/api/books", BooksRouter);
app.use("/api/reviews", ReviewRouter);
// app.use('/storage', express.static("./storage"));

app.get('/storage/:filename', (req, res)=>{
	const filename = "./storage/" + req.params.filename;
	if (fs.existsSync(filename)){
		res.download(filename);
	} else {
		res.status(404).end();
	}
});

app.use((err, req, res, next)=>{
	if (err){
		console.log(err.stack);
		if (!res.headersSent){
			res.status(500).json({
				message: "Terjadi kesalahan di bagian server, mohon dicoba lagi pada waktu lain"
			});
		}
	}
});

const server = app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
initialize(server, {cors: WHITELISTED_URL, credentials: true}, sessionMiddleware);