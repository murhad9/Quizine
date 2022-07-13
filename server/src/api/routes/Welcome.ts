import * as express from 'express';
// eslint-disable-next-line new-cap
const router = express.Router();

const controller = require('../controllers/WelcomeController');
router.get('/', controller.get);
router.get('/surprise', controller.surprise);

module.exports = router;
