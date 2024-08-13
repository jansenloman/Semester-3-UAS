const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./storage");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage });

module.exports = upload;
