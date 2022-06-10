
const client_room_handler = class {
	constructor(options) {	
        // this.users = [];
        this.room_name = '';
        if(options.user){
            this.user = options.user
        }
        this.core;
        // this.room_name = options.room_name;
    }

    updateRoom = (options) => {
        try{
            this.room_name = options.room_name;
            this.core = undefined;
        }catch(e){

            let options = {
                "class": "clientRoomHandler",
                "function": "updateRoom",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    checkUserConnected = (id) => {
        try{
            let check = false;
            if(this.core.sockets){
                if(JSON.stringify(this.core.sockets).includes(id)){
                    check = true;
                }                    
            }        
            return check;
        }catch(e){

            let options = {
                "class": "clientRoomHandler",
                "function": "checkUsersConnected",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    checkUserAdmin = (id) => {
        try{
            let check = false;
            if(this.core.sockets){
                if(JSON.stringify(this.core.admins).includes(id)){
                    check = true;
                }                    
            }   
            return check;
        }catch(e){

            let options = {
                "class": "clientRoomHandler",
                "function": "checkUserAdmin",
                "e": e
            }
            errorHandler.log(options)
        }	                     
    }    

    updateInfo = (options) => {
        try{
            this.core = options;

            let element = $( "#user_list");
            if(element){
                element.empty();
                if(this.core.users){
                    this.core.users.forEach((user) => {
                        let name = user.username
    
                        let add = false;
                        if(this.checkUserConnected(user._id)){
                                add = true;                  
                        }
    
                        if(add === true){
                            if(this.checkUserAdmin(user._id)){
                                    name += " (Admin)"
                            }
                            element.append('<li>'+name+'</li>')
                        }
                    })
                }
            }
        }catch(e){

            let options = {
                "class": "clientRoomHandler",
                "function": "updateInfo",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }      

}