import {inject, injectable} from 'inversify';
import Types from '../types';
import {AccountService} from '../services/AccountService';
import {Request, Response} from 'express';

// This controller is temporary for now. For testing purposes.
@injectable()
/** Class to handle the logic behind socket requests, queries and responses. */
export class AccountController {
    /** Create the SocketService object */
    public constructor(
        @inject(Types.AccountService) private accountService : AccountService,
    ) {};

    /** Get the data associated with a specific account.
     *
     * @param {any} req - The request sent.
     *      - Request body : {'username' : String}
     * @param {any} res - The response sent back.
     *      - Response body :  {'username'  : String,
     *                          'darwings'  : String[],
     *                          'likes'     : Int}
    */
    public async getAccountInfo(req : any, res : any): Promise<void> {
        res.send('NOT IMPLEMENTED: Get Account Info');
    };

    /** Create an account.
     *
     * @param {any} req - The request sent.
     *      - Request body : {'email' : String,
     *                        'username' : String,
     *                        'password' : String}
     * @param {any} res - The response sent back.
     *      - Response body : None
     *      - Response codes :
     *          200 : Account created
     *          600 : Email already in use
     *          601 : Username already in use
     *          602 : DB error
    */
    public async createAccount(req : Request, res : Response): Promise<void> {
        let code: number;
        try {
            code = await this.accountService
                .createAccount(
                    req.body['username'],
                    req.body['email'],
                    req.body['password'],
                );
            res.status(code);
            if (code == 600) throw new Error('Email already in use!');
            else if (code == 601) throw new Error('Username taken!');
            else if (code == 602) throw new Error('DB ERROR');
            else res.send('Account created!');
        } catch (err) {
            this.setMessage(res);
        }
    };

    /** Login into account.
     *
     * @param {any} req - The request sent.
     *      - Request body : {'username' : String,
     *                        'password' : String}
     * @param {any} res - The response sent back.
     *      - Response body : None
     *      - Response codes :
     *          200 : Success
     *          602 : DB error
     *          603 : Username does not exist in DB
     *          604 : Wrong password entered
    */
    public async login(req : Request, res : Response): Promise<void> {
        let code: number;
        try {
            code = await this.accountService
                .login(
                    req.body['username'],
                    req.body['password'],
                );
            res.status(code);
            if (code == 602) throw new Error('DB ERROR');
            else if (code == 603) throw new Error('Username does not exist!');
            else if (code == 604) throw new Error('Wrong password!');
            else if (code == 605) throw new Error('User already connected!');
            else res.send('Login successful!');
        } catch (err) {
            this.setMessage(res);
        }
    };

    /** Logout of account.
     *
     * @param {any} req - The request sent.
     *      - Request body : {'username' : String,
     *                        'password' : String}
     * @param {any} res - The response sent back.
     *      - Response body : None
     *      - Response codes :
     *          200 : Success
    */
    public async logout(req : Request, res : Response): Promise<void> {
        const code = await this.accountService.logout(req.body['username']);
        res.status(code);
        res.statusMessage = 'Logged out succesfully!';
        res.send('Logged out succesfully!');
    };

    /** Set correct status message to the response to send.
     *
     * @param {any} res - The response sent back.
     *      - Response body : None
     *      - Response codes :
     *          600 : Email already in use
     *          601 : Username already in use
     *          602 : DB error
     *          603 : Username does not exist in DB
     *          604 : Wrong password entered
     *          Default : Other error
    */
    private setMessage(res: Response): void {
        switch (res.statusCode) {
        case 600: {
            res.statusMessage = 'Email taken';
            res.send('ERROR: Email already in use!');
            break;
        }
        case 601: {
            res.statusMessage = 'Username taken';
            res.send('ERROR: Username taken!');
            break;
        }
        case 602: {
            res.statusMessage = 'DB ERROR';
            res.send('ERROR: Check DB error message');
            break;
        }
        case 603: {
            res.statusMessage = 'Username Does Not Exist';
            res.send('ERROR: Username does not exist!');
            break;
        }
        case 604: {
            res.statusMessage = 'Wrong Password';
            res.send('ERROR: Wrong Password!');
            break;
        }
        case 605: {
            res.statusMessage = 'User already connected';
            res.send('ERROR: User already connected!');
            break;
        }
        default: {
            res.statusMessage = 'ERROR: Check code.';
            res.send('ERROR: Check code.');
            break;
        }
        };
    }
}
