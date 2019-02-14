const http = require('http');

const app = require('./app');

const port = process.env.PORT;

const server = http.createServer(app);


//PROCESS.ENV.PORT when in production 
server.listen(port);
