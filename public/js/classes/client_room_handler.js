
const client_room_handler = class {
	constructor() {	
        // this.users = [];
        this.room_name = '';
        this.core;
        // this.room_name = options.room_name;
    }

    updateRoom = (options) => {
        this.room_name = options.room_name;
        this.core = undefined;
    }

    checkUserConnected = (id) => {
        let check = false;
        if(this.core.sockets){
            if(JSON.stringify(this.core.sockets).includes(id)){
                check = true;
            }                    
        }        
        return check;
    }

    checkUserAdmin = (id) => {
        let check = false;
        if(this.core.sockets){
            if(JSON.stringify(this.core.admins).includes(id)){
                check = true;
            }                    
        }   
        return check;             
    }    

    updateInfo = (options) => {
        this.core = options;

        let element = $( "#user_list");
        if(element){
            element.empty();
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

}