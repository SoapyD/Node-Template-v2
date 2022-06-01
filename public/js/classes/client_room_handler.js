
const client_room_handler = class {
	constructor() {	
        this.users = [];
        this.room_name = '';
        // this.room_name = options.room_name;
    }

    updateRoom = (options) => {
        this.room_name = options.room_name;
        this.users = [];
    }

    updateUsers = (options) => {
        this.users = options.users;
    }    

}