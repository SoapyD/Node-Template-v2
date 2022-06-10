

const server_socket_handler = class {
	constructor(options) {	

        this.io = options.io
        this.namespace = options.namespace
        this.functions = {};
        this.functions.core = {};

        this.defineCoreFunctions();
    }


    checkMessages = () => {
        this.io.of(this.namespace).on('connection', (socket, req)=> {

            //THIS IS A GENERIC MESSAGE HANDLER, ALLOWS CLIENT SIDE TO SEND VARIABLE FUNCTIONGROUP AND FUNCTION NAME TO RUN ON SERVER
            socket.on('message_server', (options) => {

                try{
                    this.functions[options.functionGroup][options.function](socket,options);
                }
                catch(e){
                    let options = {
                        "class": "socket_handler",
                        "function": "message_server",
                        "e": e
                    }
                    errorHandler.log(options)
                }			
            })


            //THIS HANDLES ANY DISCONNECTING CLIENTS. IT REMOVES THEIR SOCKET REFERENCES FROM ANY ROOMS IN THE DB
            //ALLOWS ME TO TELL IF A CLIENT IS ALREADY IN THE ROOM OR WAS ONCE IN THE ROOM AND CAN REJOIN
            socket.on('disconnect', async() => {

                try{
                    // let rooms = await queriesUtil.findRoomsWithSocket(socket.id)
                    let rooms = await databaseHandler.findData({
                        model: "Room"
                        ,search_type: "findOne"
                        ,params: {
                            sockets: {$elemMatch: {socket: socket.id}}
                        }
                    })                    
        
                    if (rooms[0] !== null){
                    	let room = rooms[0];
                        let sockets = rooms[0].sockets; 	
                        const utils = require("../utils");

                    	sockets = utils.functions.removeFromObjectArray(room.sockets, "socket",socket.id)
                    	// room.sockets = sockets;
                        // room.save();
                        await databaseHandler.updateData(room,
                        {
                            params: [{sockets: sockets}]
                        })
                        
                        await this.sendRoomData(room.room_name)
                    	socket.leave(room.room_name)
                    	console.log("user disconnected: "+socket.id);
                    }
                }
                catch(e){
                    let options = {
                        "class": "socket_handler",
                        "function": "disconnect",
                        "e": e
                    }
                    errorHandler.log(options)
                }

            })	

        })
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    //  #####  ####### ######  #######       ####### #     # #     #  #####  ####### ### ####### #     #  #####  
    // #     # #     # #     # #             #       #     # ##    # #     #    #     #  #     # ##    # #     # 
    // #       #     # #     # #             #       #     # # #   # #          #     #  #     # # #   # #       
    // #       #     # ######  #####   ##### #####   #     # #  #  # #          #     #  #     # #  #  #  #####  
    // #       #     # #   #   #             #       #     # #   # # #          #     #  #     # #   # #       # 
    // #     # #     # #    #  #             #       #     # #    ## #     #    #     #  #     # #    ## #     # 
    //  #####  ####### #     # #######       #        #####  #     #  #####     #    ### ####### #     #  #####  
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    sendMessage = (options) => {

        try{
            switch(options.type){
                case "source":
                    this.io.to(options.id).emit("message_client", options)
                    break;
                case "room":
                    this.io.in(options.id).emit("message_client", options)
                    break;                
            }
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "sendMessage",
                "e": e
            }
            errorHandler.log(options)
        }	

    }

    defineCoreFunctions = () => {
        try{
            Object.getOwnPropertyNames(this).forEach((method) => {
                this.functions.core[method] = this[method];
            })    
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "defineCoreFunctions",
                "e": e
            }
            errorHandler.log(options)
        }	            
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    //  ####### #######  #####  ####### 
    //     #    #       #     #    #    
    //     #    #       #          #    
    //     #    #####    #####     #    
    //     #    #             #    #    
    //     #    #       #     #    #    
    //     #    #######  #####     #    
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    test = async(socket, options)  => {

        try{
            console.log(options)
    
            this.sendMessage({
                type: "source",
                id: socket.id,
                functionGroup: "core",
                function: "test",
                message: options.message
            })
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "test",
                "e": e
            }
            errorHandler.log(options)
        }        
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    //  #####  #     # #######  #####  #    #       ######  ####### ####### #     # 
    // #     # #     # #       #     # #   #        #     # #     # #     # ##   ## 
    // #       #     # #       #       #  #         #     # #     # #     # # # # # 
    // #       ####### #####   #       ###    ##### ######  #     # #     # #  #  # 
    // #       #     # #       #       #  #         #   #   #     # #     # #     # 
    // #     # #     # #       #     # #   #        #    #  #     # #     # #     # 
    //  #####  #     # #######  #####  #    #       #     # ####### ####### #     # 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    checkRoom = async(socket, options)  => {

        //SEE IF ROOM EXISTS ALREADY
        let rooms;
        let room;
        let saved_room;
        let room_joined = false;

        try{
            rooms = await databaseHandler.findData({
                model: "Room"
                ,search_type: "findOne"
                ,params: {
                    room_name: options.data.room_name
                }
            })

        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "createRoom findRoom",
                "e": e
            }
            errorHandler.log(options)
        }			
    
        try{

            let return_options = {
                type: "source",
                id: socket.id,
                functionGroup: "core",
                function: "printConnectionStatus",
                data: {
                    user_name: "SERVER",
                    message: ""
                }  
            }

            // ##################################################################################
            // ##################################################################################
            // ##################################################################################
            //  ██████ ██████  ███████  █████  ████████ ███████       ██████   ██████   ██████  ███    ███ 
            // ██      ██   ██ ██      ██   ██    ██    ██            ██   ██ ██    ██ ██    ██ ████  ████ 
            // ██      ██████  █████   ███████    ██    █████   █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
            // ██      ██   ██ ██      ██   ██    ██    ██            ██   ██ ██    ██ ██    ██ ██  ██  ██ 
            //  ██████ ██   ██ ███████ ██   ██    ██    ███████       ██   ██  ██████   ██████  ██      ██ 
            // ##################################################################################
            // ##################################################################################
            // ##################################################################################

            //IF ROOM DOES EXIST
            if(options.data.action === 'create'){
                if (rooms[0] !== null){
     
                    //CHECK TO SEE IF THE USER IS ALREADY IN THE ROOM OR NOT IN THE ROOM BUT ABLE TO JOIN IT
                    let room = rooms[0];
                    if(room.users.indexOf(options.data.users[0]) > -1){
                        if(room.sockets.indexOf(socket.id) > -1){
                            return_options.data.message = "You're already in this room";							
                        }else{
                            return_options.data.message = "Room already exists, please use join button to rejoin it";								
                        }
                    }
                    else{
                        return_options.data.message = 'Creation failed, please choose another room name and try again';							
                    }
                    
                    //RETURN THE MESSAGE BACK TO THE USER
                    this.sendMessage(return_options)
                }
                else{
    
                    //CREATE THE ROOM

                    let params = options.data
                    params.sockets = [];
                    params.sockets.push({
                        socket: socket.id
                        ,user: options.data.users[0]
                    });
    
                    room = await databaseHandler.createData({
                        model: "Room"
                        ,params: [
                            params
                        ]
                    })
    
                    room = room[0]
                    
                    
                    //SEND THE CORE GAME DATA OT THE PLAYER
                    let return_options = {
                        type: "source"
                        ,id: socket.id
                        ,functionGroup: "core"
                        ,function: "printConnectionStatus"
                        ,data: {
                            message: "Room Created"
                            ,success: true
                            // ,room_name: options.data.room_name
                            // ,room_id: room._id
                        }
                    }
                    socket.join(options.data.room_name)
    
                    this.sendMessage(return_options)

                    room_joined = true;
                 
                }
            }

            // ##################################################################################
            // ##################################################################################
            // ##################################################################################
            // 		██  ██████  ██ ███    ██       ██████   ██████   ██████  ███    ███ 
            // 		██ ██    ██ ██ ████   ██       ██   ██ ██    ██ ██    ██ ████  ████ 
            // 		██ ██    ██ ██ ██ ██  ██ █████ ██████  ██    ██ ██    ██ ██ ████ ██ 
            // ██   ██ ██    ██ ██ ██  ██ ██       ██   ██ ██    ██ ██    ██ ██  ██  ██ 
            // 	█████   ██████  ██ ██   ████       ██   ██  ██████   ██████  ██      ██ 														
            // ##################################################################################
            // ##################################################################################
            // ##################################################################################

            if(options.data.action === 'join'){
                if (rooms[0] !== null){
                    //TRY AND JOIN THE ROOM
                    room = rooms[0]
                
                    //CHECK THE PASSWORD
                    if(room.password !== options.data.password)
                    {
                        return_options.data.message = "Wrong password! Please try again";
                    }else{
                        //IF USER IS A MEMBER OF THE ROOM
                        // if(room.users.indexOf(options.data.user) > -1){
                        if(JSON.stringify(room.users).includes(options.data.users[0])){
                            //IF THE USER IS STILL IN THE ROOM
                            if(room.sockets.indexOf(socket.id) > -1){
                                return_options.data.message = "You're already in this room";
                            }else{
                                return_options.data.message = "Rejoined room.";	
                                return_options.data.success = true;
                                                
                                socket.join(options.data.room_name) 
                                room.sockets.push({
                                    socket: socket.id
                                    ,user: options.data.users[0]
                                });
                                saved_room = await room.save()
                                room_joined = true;                                
                            }
                        }
                        else{
                            room.users.push(options.data.users[0])
                            room.sockets.push({
                                socket: socket.id
                                ,user: options.data.users[0]
                            });                        

                            let returned_rooms = await databaseHandler.updateData(room)
                            saved_room = returned_rooms[0];
                

                            return_options.data.message = "Room Joined"
                            return_options.data.success = true;
                            socket.join(options.data.room_name)                             
                            room_joined = true;
                        }
                    }                                      
                }
                else{
                    return_options.data.message = "Join failed. Room Doesn't exist"
                    
                }              
                //RETURN THE MESSAGE BACK TO THE USER
                this.sendMessage(return_options)                    
            }


            if(room_joined === true){
                if(room.use_waiting_room === true){
                    this.sendToWaitingRoom(socket, options.data.room_name)                
                }else{
                    this.startRoom(socket, options.data.room_name)                    
                }
            }

        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "checkRoom",
                "e": e
            }
            errorHandler.log(options)
        }				
    }
    
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################    
    // #     #    #    ### ####### ### #     #  #####        ######  ####### ####### #     # 
    // #  #  #   # #    #     #     #  ##    # #     #       #     # #     # #     # ##   ## 
    // #  #  #  #   #   #     #     #  # #   # #             #     # #     # #     # # # # # 
    // #  #  # #     #  #     #     #  #  #  # #  #### ##### ######  #     # #     # #  #  # 
    // #  #  # #######  #     #     #  #   # # #     #       #   #   #     # #     # #     # 
    // #  #  # #     #  #     #     #  #    ## #     #       #    #  #     # #     # #     # 
    //  ## ##  #     # ###    #    ### #     #  #####        #     # ####### ####### #     # 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    sendToWaitingRoom = (socket, room_name) => {
        try{
            let return_options = {
                type: "source",
                id: socket.id,
                functionGroup: "core",
                function: "joinWaitingRoom",
                data: {
                    user_name: "SERVER",
                    message: "",
                    room_name: room_name
                }  
            }        

            this.sendMessage(return_options)  
            this.sendRoomData(room_name) 
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "sendToWaitingRoom",
                "e": e
            }
            errorHandler.log(options)
        }	            
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################    
    //  #####  #######    #    ######  #######       ######  ####### ####### #     # 
    // #     #    #      # #   #     #    #          #     # #     # #     # ##   ## 
    // #          #     #   #  #     #    #          #     # #     # #     # # # # # 
    //  #####     #    #     # ######     #    ##### ######  #     # #     # #  #  # 
    //       #    #    ####### #   #      #          #   #   #     # #     # #     # 
    // #     #    #    #     # #    #     #          #    #  #     # #     # #     # 
    //  #####     #    #     # #     #    #          #     # ####### ####### #     # 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    startRoom = async(socket, room_name) => {
        
        try{
            await this.sendRoomData(room_name)

            let return_options = {
                type: "source",
                id: socket.id,
                functionGroup: "core",
                function: "startRoom"
            }        

            this.sendMessage(return_options) 
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "startRoom",
                "e": e
            }
            errorHandler.log(options)
        }	
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    //  #####  ####### #     # ######        ######  ####### ####### #     #       ######     #    #######    #    
    // #     # #       ##    # #     #       #     # #     # #     # ##   ##       #     #   # #      #      # #   
    // #       #       # #   # #     #       #     # #     # #     # # # # #       #     #  #   #     #     #   #  
    //  #####  #####   #  #  # #     # ##### ######  #     # #     # #  #  # ##### #     # #     #    #    #     # 
    //       # #       #   # # #     #       #   #   #     # #     # #     #       #     # #######    #    ####### 
    // #     # #       #    ## #     #       #    #  #     # #     # #     #       #     # #     #    #    #     # 
    //  #####  ####### #     # ######        #     # ####### ####### #     #       ######  #     #    #    #     # 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    sendRoomData = async(room_name) => {
        try{
            let rooms = await databaseHandler.findData({
                model: "Room"
                ,search_type: "findOne"
                ,params: {
                    room_name: room_name
                }
            })

            if (rooms[0] !== null){
                let room = rooms[0];

                let return_options = {
                    type: "room",
                    id: room_name,
                    functionGroup: "core",
                    function: "updateRoomData",
                    data: room  
                }        
        
                this.sendMessage(return_options)        
            }

        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "sendRoomData",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    // #     # #######  #####   #####     #     #####  #######       ######  ####### ####### #     # 
    // ##   ## #       #     # #     #   # #   #     # #             #     # #     # #     # ##   ## 
    // # # # # #       #       #        #   #  #       #             #     # #     # #     # # # # # 
    // #  #  # #####    #####   #####  #     # #  #### #####   ##### ######  #     # #     # #  #  # 
    // #     # #             #       # ####### #     # #             #   #   #     # #     # #     # 
    // #     # #       #     # #     # #     # #     # #             #    #  #     # #     # #     # 
    // #     # #######  #####   #####  #     #  #####  #######       #     # ####### ####### #     #  
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    messageRoom = (socket, options) => {

        try{
            this.sendMessage({
                type: "room",
                id: options.id,                
                functionGroup: options.data.functionGroup,
                function: options.data.function,
                parameters: options.data.parameters,
                message: options.message,
            })            
        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "messageAll",
                "e": e
            }
            errorHandler.log(options)
        }				
    }
    
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
    // #     # #######  #####   #####     #     #####  #######       #     #  #####  ####### ######  
    // ##   ## #       #     # #     #   # #   #     # #             #     # #     # #       #     # 
    // # # # # #       #       #        #   #  #       #             #     # #       #       #     # 
    // #  #  # #####    #####   #####  #     # #  #### #####   ##### #     #  #####  #####   ######  
    // #     # #             #       # ####### #     # #             #     #       # #       #   #   
    // #     # #       #     # #     # #     # #     # #             #     # #     # #       #    #  
    // #     # #######  #####   #####  #     #  #####  #######        #####   #####  ####### #     #
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    messageUser = (socket, options) => {
    
        try{
            this.sendMessage({
                type: "source",
                id: socket.id,                
                functionGroup: options.data.functionGroup,
                function: options.data.function,
                parameters: options.data.parameters,
                message: options.message,
            })  

        }
        catch(e){
            let options = {
                "class": "socket_handler",
                "function": "messageUser",
                "e": e
            }
            errorHandler.log(options)
        }				
    }


}

module.exports = server_socket_handler