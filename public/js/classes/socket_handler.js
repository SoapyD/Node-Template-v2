
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
                this.disconnected = false;
                this.reconnectedHandler()
            }
        });        
    }

    disconnectedHandler = () => {
        this.showAlert('liveMessage', 
            {
                message: "Disconnected from Server"
            }
        )        
    }

    reconnectedHandler = () => {
        this.showAlert('liveMessage', 
            {
                message: "Re-Connected to Server"
                ,success: true
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

    defineCoreFunctions = () => {
        this.functions.core.test = this.test;  
        this.functions.core.printConnectionStatus = this.printConnectionStatus;                      
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

    test = (options) => {
        console.log(options)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // ######  ######  ### #     # #######       #     # #######  #####   #####     #     #####  #######  #####  
    // #     # #     #  #  ##    #    #          ##   ## #       #     # #     #   # #   #     # #       #     # 
    // #     # #     #  #  # #   #    #          # # # # #       #       #        #   #  #       #       #       
    // ######  ######   #  #  #  #    #    ##### #  #  # #####    #####   #####  #     # #  #### #####    #####  
    // #       #   #    #  #   # #    #          #     # #             #       # ####### #     # #             # 
    // #       #    #   #  #    ##    #          #     # #       #     # #     # #     # #     # #       #     # 
    // #       #     # ### #     #    #          #     # #######  #####   #####  #     #  #####  #######  #####  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    showAlert = (id, options) => {
        let el = document.getElementById(id)
        el.style.display='block' //make visible

        //TOGGLE IF IT'S GOING TO BE A SUCCESS OR DANGER MESSAGE
        if(options.success){
            el.classList.remove("alert-danger");
            el.classList.add("alert-success");
        }else{
            el.classList.remove("alert-success");
            el.classList.add("alert-danger");            
        }

        //SET INNER HTML TO RETURNED MESSAGE
        el.innerHTML = options.message
        window.setTimeout("document.getElementById('"+id+"').style.display='none';", 4000); //set timeout        
    }

    //SELECT THE CONNECTION MESSAGE ALERT IN THE JOIN AND CREATE TAB
    printConnectionStatus = (options) => {
        // let el = document.getElementById('connectionMessage')
        this.showAlert('connectionMessage', options.data)

        //unselect connection option
        document.getElementById('connectionOptions').value = ""        
    }


}