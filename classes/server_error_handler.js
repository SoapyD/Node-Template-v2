
const server_error_handler = class {
	constructor(options) {	

        this.errors = [];
    }

    log(options) {

        try{

            this.errors.push(options)

            let error_message = "-----------\nERROR\n-----------\n"

            if(options.class){
                // console.log("class:",options.class)
                error_message += 'class: '+options.class+'\n'
            }

            if(options.function){
                // console.log("function:",options.function)
                error_message += 'function: '+options.function+'\n'
            }

            if(options.e){
                // console.log("error:")
                error_message += 'error message:'+'\n'+options.e.message+'\n'+'\n'
                error_message += 'error stack:'+'\n'+options.e.stack+'\n'
                // console.log(options.e)
            }

            console.log(error_message)

            // if(options.e.stack){
            //     options.e = options.e.stack;
            // }
            if(!options.detail){
                options.detail = "";
            }

            databaseHandler.createData({
                model: "Error"
                ,params: [
                    options
                ]
            })


        }catch(e){
            console.log("error handler has errored")
            console.log(e)
        }

    }
}


module.exports = server_error_handler