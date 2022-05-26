
const socket_handler = class {
	constructor(options) {	

        this.socket_address = options.socket_address;
        this.socket = io(this.socket_address, {transports: ["websocket"]})
        this.disconnected = false

        this.functions = {};
        this.functions.core = {};        
        this.defineCoreFunctions();
        

        this.checkMessages(this.socket)
        this.checkConnectionStatus()
    }

    messageServer = (options) => {	
        this.socket.emit('message_server', options)
    }

    checkMessages = () => {
    
        //THIS IS A GENERIC RESPONSE HANDER THAT RUNS WHATEVER FUNCTION, IN WHATEVER GROUP, IS PASSED TO IT
        this.socket.on('message_client', (options) => {
    
            if(options.message){
                switch(instance_type){
                    case "DEV":
                    case "DEV-ONLINE":			
                        if(options){
                            console.log(options.message)
                            console.log(options)
                        }
                        break;
                }
            }
            
            if(options.functionGroup && options.function){
                this.functions[options.functionGroup][options.function](options);  			
            }
    
        })
    }   

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  #####  ####### #     # #     # #######  #####  ####### ### ####### #     #       #     #    #    #     # ######  #       ####### ######  
    // #     # #     # ##    # ##    # #       #     #    #     #  #     # ##    #       #     #   # #   ##    # #     # #       #       #     # 
    // #       #     # # #   # # #   # #       #          #     #  #     # # #   #       #     #  #   #  # #   # #     # #       #       #     # 
    // #       #     # #  #  # #  #  # #####   #          #     #  #     # #  #  # ##### ####### #     # #  #  # #     # #       #####   ######  
    // #       #     # #   # # #   # # #       #          #     #  #     # #   # #       #     # ####### #   # # #     # #       #       #   #   
    // #     # #     # #    ## #    ## #       #     #    #     #  #     # #    ##       #     # #     # #    ## #     # #       #       #    #  
    //  #####  ####### #     # #     # #######  #####     #    ### ####### #     #       #     # #     # #     # ######  ####### ####### #     # 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    checkConnectionStatus = () => {
        this.socket.on('disconnect', () => { 

            this.disconnected = true;
            this.disconnectedHandler()
        });
        
        this.socket.on('connect', () => { 
        
            if(this.disconnected === true){		
                console.log(this)

                this.disconnected = false;
                this.reconnectedHandler()
            }
        });        
    }

    disconnectedHandler = () => {
        console.log("Disconnected from Server")
    }

    reconnectedHandler = () => {
        console.log("Re-Connected to Server")
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

    defineCoreFunctions = () => {
        this.functions.core.test = this.test;              
    }

    test = (options) => {
        console.log(options)
    }

}