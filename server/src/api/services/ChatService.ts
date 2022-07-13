import {injectable} from 'inversify';
import * as socketIO from 'socket.io';

@injectable()
/** Class in charge of the socket logic behind chat actions */
export class ChatService {
    private socketServer: socketIO.Server;
    private usernameMap: Map<string, string>;

    /** Create the ChetService object */
    public constructor() {
        this.usernameMap = new Map<string, string>();
    }

    /** Initialize the socket for the chat
     *
     * @param {http.Server} server - The server to connect to.
    */
    public init(server: socketIO.Server): void {
        this.socketServer = server;
        this.socketServer.on('connection', (currentSocket: socketIO.Socket) => {
            currentSocket.on('sendUsername', (info: any)=>{
                this.usernameMap.set(currentSocket.id, info['username']);
                // For debugging purposes
                console.log('Username : '+info['username']);
                // const global = require('../../global');
                // console.log('User List : '+global);
            });
            // Connection
            console.log('New connection for socket : '+currentSocket.id);

            // New connection and disconnection messages.
            // Currently sends socket ids. Try to change to username later.
            // currentSocket.broadcast.emit('message',
            //     'Welcome : ' + currentSocket.id);
            // Disconnection
            currentSocket.on('disconnect', () => {
                console.log('Disconnection of socket : '+
                    currentSocket.id);
                const global = require('../../global');
                const currentUsername = this.usernameMap.get(currentSocket.id);
                const index = global.userList.indexOf(currentUsername);
                if (index > -1) {
                    global.userList.splice(index, 1);
                    this.usernameMap.delete(currentSocket.id);
                    console.log('Logging out : ' + currentUsername);
                }
                // currentSocket.broadcast.emit('message',
                //     'Bye user : ' + currentSocket.id);
            });
            // Sending & Broadcasting message NO ROOM - Remove when we use rooms
            currentSocket.on('sendMessage', (message: any) => {
                message['timestamp'] = new Date(new Date().getTime())
                    .toLocaleTimeString('en-GB', {timeZone: 'America/New_York'})
                    .replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
                console.log('Message from ' +
                    message['sender'] + ': ' +
                    message['content']);
                this.socketServer.emit('newMessage',
                    {sender: message['sender'],
                        content: message['content'],
                        timestamp: message['timestamp']});
            });
            /** Uncomment when we switch to specific rooms after prototype.
            // Joining specific rooms
            currentSocket.on('newChatRoom', (room: string) => {
                // Sending & Broadcasting messages
                currentSocket.on('sendMessage', (message: string) => {
                    console.log(currentSocket.id +
                        ' to room [' + room + '] : ' + message);
                    currentSocket.broadcast.to(room).emit('newMessage',
                        {uid: currentSocket.id, message: message});
                });
                console.log('Connecting user ' +
                    currentSocket.id + ' to room: ' + room);
                currentSocket.join(room);
            });
            */
        });
    }
}
