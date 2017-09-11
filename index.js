const {send, json} = require('micro');
const jwt = require('jsonwebtoken');
const Router = require('micro-http-router');
const { setupJWT, verifyToken } = require('micro-http-router-jwt');

const secret = 'I am super secret, yes I am';

setupJWT({ secret: secret });

const router = new Router();
router.get('/', async (req, res) => {
    send(res, 200, 'Hello, World');
});

router.post('/login', async (req, res) => {
    const body = await json(req);

    if (!('username' in body) || !('password' in body)) {
        send(res, 400, 'Please provide a username and password.');
    } else {
        const token = jwt.sign({ username: body.username }, secret);
        send(res, 200, { token: token });
    }
});

router.get('/protected', verifyToken, async (req, res) => {
    send(res, 200, `Hello, ${ req.token.username }`);
});

module.exports = async (req, res) => router.handle(req, res);