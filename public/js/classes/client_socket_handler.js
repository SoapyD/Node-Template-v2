
const client_socket_handler = class {
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

        try{
            this.socket.emit('message_server', options)
        }catch(e){

            // console.log("ISSUE CAUSING ERRORS:", options)

            let options = {
                "class": "socketHandler",
                "function": "messageServer",
                "e": e
            }
            errorHandler.log(options)
        }		
    }

    checkMessages = () => {
        try{
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
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "checkMessages",
                "e": e
            }
            errorHandler.log(options)
        }	        
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
        // try{
            this.showAlert('liveMessage', 
                {
                    message: "Disconnected from Server"
                }
            )   
        // }catch(e){

        //     let options = {
        //         "class": "socketHandler",
        //         "function": "disconnectedHandler",
        //         "e": e
        //     }
        //     errorHandler.log(options)
        // }	             
    }

    reconnectedHandler = () => {
        try{
            this.showAlert('liveMessage', 
                {
                    message: "Re-Connected to Server"
                    ,success: true
                })          
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "reconnectedHandler",
                "e": e
            }
            errorHandler.log(options)
        }	                  
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
        try{
            //LOOP THROUGH METHODS AND MAKE THEM ACCESSIBLE FUNCTIONS
            Object.getOwnPropertyNames(this).forEach((method) => {
                this.functions.core[method] = this[method];
            })
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "defineCoreFunctions",
                "e": e
            }
            errorHandler.log(options)
        }	        
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
        try{
            console.log(options)
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "test",
                "e": e
            }
            errorHandler.log(options)
        }	        
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
        try{
            let el = document.getElementById(id)
            if(el){
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
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "showAlert",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    //SELECT THE CONNECTION MESSAGE ALERT IN THE JOIN AND CREATE TAB
    printConnectionStatus = (options) => {
        try{
            // let el = document.getElementById('connectionMessage')
            this.showAlert('connectionMessage', options.data)

            //unselect connection option
            let el = document.getElementById('connectionOptions')
            if(el){
                el.value = ""        
            }
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "printConnectionStatus",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //       # ####### ### #     #       #     #    #    ### ####### ### #     #  #####        ######  ####### ####### #     # 
    //       # #     #  #  ##    #       #  #  #   # #    #     #     #  ##    # #     #       #     # #     # #     # ##   ## 
    //       # #     #  #  # #   #       #  #  #  #   #   #     #     #  # #   # #             #     # #     # #     # # # # # 
    //       # #     #  #  #  #  # ##### #  #  # #     #  #     #     #  #  #  # #  #### ##### ######  #     # #     # #  #  # 
    // #     # #     #  #  #   # #       #  #  # #######  #     #     #  #   # # #     #       #   #   #     # #     # #     # 
    // #     # #     #  #  #    ##       #  #  # #     #  #     #     #  #    ## #     #       #    #  #     # #     # #     # 
    //  #####  ####### ### #     #        ## ##  #     # ###    #    ### #     #  #####        #     # ####### ####### #     # 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    joinWaitingRoom = (options) => {  
        try{
            clientRoomHandler.updateRoom(options.data)
            let timer = 2000;

            window.setTimeout(() => {
                let myOffcanvas = document.getElementById('offcanvasRight')
                var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas)
                bsOffcanvas.hide();            
            }, timer)

            window.setTimeout(() => {
                let myOffcanvas = document.getElementById('waiting_offcanvasRight')
                var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas)
                bsOffcanvas.show();            
            }, timer)        
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "joinWaitingRoom",
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

    startRoom = () => {

        try{
            let timer = 2000;

            window.setTimeout(() => {
                let myOffcanvas = document.getElementById('offcanvasRight')
                if(myOffcanvas){
                    var bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas)
                    bsOffcanvas.hide();            
                }

                myOffcanvas = document.getElementById('waiting_offcanvasRight')
                if(myOffcanvas){
                    bsOffcanvas = bootstrap.Offcanvas.getInstance(myOffcanvas)
                    bsOffcanvas.hide();            
                }
                let el = document.getElementById('login__blackout')
                if(el){
                    // element.classList.add("login__blackout_expanded");
                    $( "#socket__join_button").fadeOut(() => {
                        $( "#login__blackout").slideDown()
                        // $( "#socket__join_button").remove(() => {
                        //     $( "#login__blackout").slideDown()
                        // })
                    })
                }

            }, timer)    
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "startRoom",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    updateRoomData = (options) => {
        try{
            clientRoomHandler.updateInfo(options.data)
        }catch(e){

            let options = {
                "class": "socketHandler",
                "function": "messageServer",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

}
