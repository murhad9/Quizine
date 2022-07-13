import express from 'express';
import {injectable} from 'inversify';
import 'reflect-metadata';
import {socketRouter} from './routes/Socket';
import {accountRouter} from './routes/Account';
import * as path from 'path';
import cors from 'cors';

@injectable()
/** Class representing the express app */
export class Application {
    public app: express.Application;

    /** Create the Application object */
    public constructor() {
        this.app = express();
        this.setupRoutes();
    }

    /** Link the route files to sepcific routes */
    private setupRoutes(): void {
        // Define the constants to the route files.
        const welcomeRoute = require('./routes/Welcome');
        // const socketRoute = require('./routes/Socket');

        // Setup middlewares
        // TODO is needed later. (Logger and such)
        this.app.use(express.json());
        this.app.use(cors());

        // Bind the routes to adresses.
        this.app.get('/test', (req:any, res:any) => {
            res.sendFile(path.join(__dirname+'/test.html'));
        });
        this.app.use('/welcome', welcomeRoute);
        this.app.use('/socket', socketRouter);
        this.app.use('/account', accountRouter);
    }
}
