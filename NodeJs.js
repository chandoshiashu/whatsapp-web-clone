const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Datastore = require("nedb");

const path = 'views';

const Database = new Datastore("DBMS.db");
Database.loadDatabase();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get(`/home`, (req, res) => {
	res.render("Whatsapp");
})

io.on(`connection`, (socket) => {
	socket.on("recieve-msg", (Name, Msg, room) => {
		// socket.to("9VxwO7v6FcZtMXSHAAAT").emit("send-msg", Name, Msg, socket.id);
		// console.log("The room is :- ", room);
		if(room === ''){
			socket.broadcast.emit("send-msg", Name, Msg, socket.id, room);
		}
		else{
			socket.to(room).emit("send-msg", Name, Msg, socket.id, room);
		}
	});
});

server.listen(5000, () => {
	console.log("Server is Listening at Port 5000...");
});









