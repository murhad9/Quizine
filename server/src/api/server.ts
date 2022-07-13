import {inject, injectable} from 'inversify';
import {Application} from './app';
import Types from './types';
import * as http from 'http';
import {SocketService} from './services/SocketService';

// import * as socketIO from 'socket.io';

@injectable()
/** Class representing the server */
export class Server {
    private port = process.env.PORT || 3000;
    public server: http.Server;

    /** Create the Server object */
    constructor(@inject(Types.Application) private application: Application,
        @inject(Types.SocketService) private socketService: SocketService) {}

    /** Initialize the Server object */
    public init(): void {
        this.application.app.set('port', this.port);
        // We create a server with http to use http.Server.listen()
        // instead of app.listen. Needed to implement socket.io
        this.server = http.createServer(this.application.app);
        // Listen on port.
        this.server.listen(this.port,
            () => console.log(`Server running on port ${this.port}`));
        // Initiate all services with sockets.
        this.socketService.init(this.server);
    }
}

// Section to run the server
import {container} from '../inversify.config';
const server = container.get<Server>(Types.Server);
server.init();
