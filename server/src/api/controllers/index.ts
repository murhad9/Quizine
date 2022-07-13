// export * from './WelcomeController';
import {SocketController} from './SocketController';
import {SocketService} from '../services/SocketService';
import {ChatService} from '../services/ChatService';
import {AccountController} from './AccountController';
import {AccountService} from '../services/AccountService';


// Socket controller
const chatService = new ChatService();
const socketService = new SocketService(chatService);
const socketController = new SocketController(socketService);

// Login controller
const accountService = new AccountService();
const accountController = new AccountController(accountService);

export {socketController};
export {accountController};
