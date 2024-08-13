const { Server } = require("socket.io");
let io;

function dispatch(fn) {
	fn(io);
}

function initialize(httpServer, options, sessionMiddleware) {
	io = new Server(httpServer, options);
	// https://socket.io/how-to/use-with-express-session#:~:text=How%20to%20use%20with%20express-session%201%20Modifying%20the,%28socket%29%20%3D%3E%20%7B%20...%204%20With%20TypeScript%20
	const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
	io.use(wrap(sessionMiddleware));
	io.use((socket, next) => {
		if (socket.request.session.user) next();
		else next(new Error("Unauthorized user"));
	});

	io.on("connection", (socket) => {
		socket.on("joinRoom", room => {
			socket.join("book-" + room.toString());
		});
	});
}
module.exports = { initialize, dispatch };
