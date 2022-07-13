import 'reflect-metadata';
import {Container} from 'inversify';
import {Application} from './api/app';
import {Server} from './api/server';
import {SocketService} from './api/services/SocketService';
import {ChatService} from './api/services/ChatService';
import {AccountService} from './api/services/AccountService';
import Types from './api/types';

const container = new Container;

container.bind(Types.Application).to(Application);
container.bind(Types.Server).to(Server);
container.bind(Types.SocketService).to(SocketService);
container.bind(Types.ChatService).to(ChatService);
container.bind(Types.AccountService).to(AccountService);

export {container};
