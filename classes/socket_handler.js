

const socket_handler = class {
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
                    let rooms = await database_handler.findData({
                        model: "Room"
                        ,search_type: "findOne"
                        ,params: {
                            sockets: socket.id
                        }
                    })                    
        
                    if (rooms[0] !== null){
                    	let room = rooms[0];
                        let sockets = rooms[0].sockets; 	
                        const utils = require("../utils");

                    	sockets = utils.functions.removeFromArray(sockets, socket.id)
                    	room.sockets = sockets;
                    	room.save();
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  #####  ####### ######  #######       ####### #     # #     #  #####  ####### ### ####### #     #  #####  
    // #     # #     # #     # #             #       #     # ##    # #     #    #     #  #     # ##    # #     # 
    // #       #     # #     # #             #       #     # # #   # #          #     #  #     # # #   # #       
    // #       #     # ######  #####   ##### #####   #     # #  #  # #          #     #  #     # #  #  #  #####  
    // #       #     # #   #   #             #       #     # #   # # #          #     #  #     # #   # #       # 
    // #     # #     # #    #  #             #       #     # #    ## #     #    #     #  #     # #    ## #     # 
    //  #####  ####### #     # #######       #        #####  #     #  #####     #    ### ####### #     #  #####  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    sendMessage = (options) => {
        switch(options.type){
            case "source":
                this.io.to(options.id).emit("message_client", options)
                break;
            case "room":
                this.io.in(options.id).emit("message_client", options)
                break;                
        }
    }

    defineCoreFunctions = () => {
        this.functions.core.test = this.test;
        this.functions.core.checkRoom = this.checkRoom;        
        this.functions.core.messageRoom = this.messageRoom;
        this.functions.core.messageUser = this.messageUser;                
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  ####### #######  #####  ####### 
    //     #    #       #     #    #    
    //     #    #       #          #    
    //     #    #####    #####     #    
    //     #    #             #    #    
    //     #    #       #     #    #    
    //     #    #######  #####     #    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        try{
            rooms = await database_handler.findData({
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
                    if(room.users.indexOf(options.data.user) > -1){
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
                    let params =                         
                    {
                        room_name: options.data.room_name,
                        password: options.data.password,
                        sockets: [socket.id]
                    }
                    if(options.data.user){
                        params.users = [options.data.user]
                    }
    
                    room = await database_handler.createData({
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
                            ,room_name: options.data.room_name
                            ,room_id: room._id
                        }
                    }
                    socket.join(options.data.room_name)
    
                    this.sendMessage(return_options)
                 
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
                        if(room.users.indexOf(options.data.user) > -1){
                            //IF THE USER IS STILL IN THE ROOM
                            if(room.sockets.indexOf(socket.id) > -1){
                                return_options.data.message = "You're already in this room";
                            }else{
                                return_options.data.message = "Rejoined room.";	
                                return_options.data.success = true;
                                                
                                socket.join(options.data.room_name) 
                                room.sockets.push(socket.id);
                                saved_room = await room.save()
                            }
                        }
                        else{
                            room.users.push(options.data.user)
                            room.sockets.push(socket.id)                            

                            let returned_rooms = await database_handler.updateData(room)
                            saved_room = returned_rooms[0];
                
                            return_options.data.message = "Room Joined"
                        }
                    }                                      
                }
                else{
                    return_options.data.message = "Join failed. Room Doesn't exist"
                    
                }              
                //RETURN THE MESSAGE BACK TO THE USER
                this.sendMessage(return_options)                    
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
    


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // #     # #######  #####   #####     #     #####  #######       ######  ####### ####### #     # 
    // ##   ## #       #     # #     #   # #   #     # #             #     # #     # #     # ##   ## 
    // # # # # #       #       #        #   #  #       #             #     # #     # #     # # # # # 
    // #  #  # #####    #####   #####  #     # #  #### #####   ##### ######  #     # #     # #  #  # 
    // #     # #             #       # ####### #     # #             #   #   #     # #     # #     # 
    // #     # #       #     # #     # #     # #     # #             #    #  #     # #     # #     # 
    // #     # #######  #####   #####  #     #  #####  #######       #     # ####### ####### #     #  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    messageRoom = (socket, options) => {

        try{
            this.sendMessage({
                type: "room",
                id: options.room_name,                
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
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // #     # #######  #####   #####     #     #####  #######       #     #  #####  ####### ######  
    // ##   ## #       #     # #     #   # #   #     # #             #     # #     # #       #     # 
    // # # # # #       #       #        #   #  #       #             #     # #       #       #     # 
    // #  #  # #####    #####   #####  #     # #  #### #####   ##### #     #  #####  #####   ######  
    // #     # #             #       # ####### #     # #             #     #       # #       #   #   
    // #     # #       #     # #     # #     # #     # #             #     # #     # #       #    #  
    // #     # #######  #####   #####  #     #  #####  #######        #####   #####  ####### #     #
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

module.exports = socket_handler