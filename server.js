const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.get(["/home", "/"], (req, res) => {
    res.render("Whatsapp2");
});

let Socket_Array = [];
let Room;

io.on(`connection`, (socket) => {

	socket.on(`New_User`, (User) => {
		socket.broadcast.emit(`New_User`, User);
		Socket_Array.unshift({Id : socket.id, User : User});
	});

	socket.on(`MSG`, (Sender, Message) => {
		socket.broadcast.emit(`MSG`, Sender, Message);
	});

	socket.on(`Update`, (Sender, Receiver) => {
		socket.broadcast.emit(`Update`, Sender);
		for (var i = Socket_Array.length - 1; i >= 0; i--) {
			if(Socket_Array[i].User == Receiver){
				socket.emit(`create`, socket.id);
			}
		}
	});

	socket.on('create', function(room, Id){
		Id.join(room);
		Room = room;
	})

	socket.on(`MSG_Personal`, (Array) => {
		io.sockets.in(Room).emit(`MSG_Personal`, Array);
	});

	// socket.on(`MSG_Personal`, (Message) => {
	// 	io.sockets.in(`room`).emit(`MSG_Personal`, Message)
	// });

});


module.exports = server;
