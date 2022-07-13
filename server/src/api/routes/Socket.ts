import * as express from 'express';
import {socketController} from '../controllers';
// let express = require('express');
// eslint-disable-next-line new-cap
const socketRouter = express.Router();
socketRouter.get('/', socketController.get);

// module.exports = router;
export {socketRouter};
