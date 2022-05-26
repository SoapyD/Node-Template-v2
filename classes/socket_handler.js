

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
                        "class": "socket",
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
        
                    // if (rooms.length > 0){
                    // 	let room = rooms[0];
                    // 	let sockets = rooms[0].sockets; 			
                    // 	sockets = functionsUtil.removeFromArray(sockets, socket.id)
                    // 	room.sockets = sockets;
                    // 	room.save();
                    // 	socket.leave(room.room_name)
                    // 	console.log("user disconnected: "+socket.id);
                    // }
                }
                catch(e){
                    let options = {
                        "class": "socket",
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
        this.functions.core.messageAll = this.messageAll;
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

        console.log(options)

        this.sendMessage({
            type: "source",
            id: socket.id,
            functionGroup: "connFunctions",
            function: "test",
            message: options.message
        })
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
                "class": "socket",
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
                "class": "socket",
                "function": "messageUser",
                "e": e
            }
            errorHandler.log(options)
        }				
    }


}

module.exports = socket_handler