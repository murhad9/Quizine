import {inject, injectable} from 'inversify';
import Types from '../types';
import * as http from 'http';
import * as socketIO from 'socket.io';
import {ChatService} from './ChatService';

@injectable()
/** Class in charge of the logic behind socket connections */
export class SocketService {
    private socket: socketIO.Server;

    /** Create the SocketService object */
    public constructor(
        @inject(Types.ChatService) private chatService : ChatService) {}

    /** Initialize the socket
     *
     * @param {http.Server} server - The server to connect to.
    */
    public init(server: http.Server): void {
        // Set the server socket.
        this.socket = new socketIO.Server(server, {cors: {origin: true}});
        // Set the socket for each service.
        this.chatService.init(this.socket);
    }
}
