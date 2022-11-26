import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import serverless from 'serverless-http';
import { getData } from './app/get-data';
import { login } from './app/login';
import { refreshToken } from './app/refresh-login';

const app = express();

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>This is the ista insights api!</h1>');
  res.end();
});
router.post('/login', (req, res) => login(req, res));
router.post('/refresh-token', (req, res) => refreshToken(req, res));
router.post('/data', (req, res) => getData(req, res));

app.use(bodyParser.json());
app.use(cors());
app.use('/.netlify/functions/main', router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
