import {inject, injectable} from 'inversify';
import Types from '../types';
import * as http from 'http';
import * as socketIO from 'socket.io';
import {SocketService} from '../services/SocketService';

// This controller is temporary for now. For testing purposes.
@injectable()
/** Class to handle the logic behind socket requests, queries and responses. */
export class SocketController {
    private server: http.Server;
    private socket: socketIO.Server;
    /** Create the SocketService object */
    public constructor(
        @inject(Types.SocketService) private socketService : SocketService) {};

    /** Test get method
     *
     * @param {any} req - The request sent.
     * @param {any} res - The response sent back.
    */
    public async get(req : any, res : any): Promise<void> {
        res.send('Socket route.');
    };
}
