if(!process.env.INSTANCE_TYPE){
	require('dotenv').config();
	console.log("dev env variables loaded")	
}


const classes = require('./classes');
let expressServer;
const express = require("express");
const app = express();
const utils = require("./utils");
const socketio = require('socket.io');


const middleware = require('./middleware');
middleware.setup.run(app)



switch(process.env.INSTANCE_TYPE){
	case "DEV":
	case "DEV-ONLINE":
			expressServer = app.listen(process.env.PORT||80, process.env.IP, function(){				
			console.log("dev server running")
			setTimeout(utils.timer.checkTimer, process.env.TIMER_MS);
		})	
		break;
	default:
		expressServer = app.listen(process.env.PORT, process.env.IP, function(){
			console.log("prod server running")
			setTimeout(utils.timer.checkTimer, process.env.TIMER_MS);
		})		
		break;
}
	


const io = socketio(expressServer);

const server_socket_handler = new classes.server_game_socket_handler({
	namespace: "/"
	,io: io
});


server_socket_handler.checkMessages();