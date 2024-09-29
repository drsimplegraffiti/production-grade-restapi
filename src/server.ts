import app from "./index";
import logger from "./utils/logger";

class Server{
    private port: number | string;

    constructor() {
        this.port = process.env.PORT || 7002; 
    }

    public start():void {
        app.listen(this.port, ()=> {
            logger.info(`server is running on port ${this.port}`)
            logger.info(process.env.NODE_ENV);
        })
    }
    
}

const server = new Server();
server.start();