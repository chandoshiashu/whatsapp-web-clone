
const app = require(`express`)();
const server = require(`http`).createServer(app);
const io = require(`socket.io`)(server);

const path = `views`;

app.engine(`html`, require('ejs').renderFile);
app.set(`view engine`, `html`);

app.get([`/home`, `/`], (req, res) => {
	res.render("Whatsapp2");
})

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

server.listen(8000, ()=>{
	console.log(`Listening....`);
});


