import * as express from 'express';
import {accountController} from '../controllers';

// eslint-disable-next-line new-cap
const accountRouter = express.Router();
accountRouter.post('/info', accountController.getAccountInfo);
accountRouter.post('/create',
    (req, res) => accountController.createAccount(req, res));
accountRouter.post('/login',
    (req, res) => accountController.login(req, res));
accountRouter.post('/logout',
    (req, res) => accountController.logout(req, res));

// module.exports = router;
export {accountRouter};
