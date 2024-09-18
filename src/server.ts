import app from "./index";

class Server{
    private port: number | string;

    constructor() {
        this.port = process.env.PORT || 7002; 
    }

    public start():void {
        app.listen(this.port, ()=> {
            console.log(`server is running on port ${this.port}`)
            console.log(process.env.NODE_ENV);
        })
    }
    
}

const server = new Server();
server.start();