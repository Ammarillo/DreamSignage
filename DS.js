const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');
const conf = require("config");
const server = require('http').Server(app);
const logic = require('./logic');

const io = conf.config.useSSL 
  ? require('socket.io')(https.createServer({
      key: fs.readFileSync(conf.config.sslkey),
      cert: fs.readFileSync(conf.config.sslCert)
    }, app))
  : require('socket.io')(server);
const sslServer = conf.config.useSSL 
  ? https.createServer({
      key: fs.readFileSync(conf.config.sslkey),
      cert: fs.readFileSync(conf.config.sslCert)
    }, app)
  : null;

logic.setVars(io);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

if (conf.config.useSSL) {
  app.use(logic.requireHTTPS);
}

app.get('/', (req, res) => res.render('content'));

io.on('connection', (socket) => logic.handleSocketConnection(socket, conf.config));

setInterval(() => logic.UpdateContent(conf.config), conf.config.scanIntervall * 1000);

if (conf.config.useZipDownload) {
  console.log(`Using ${conf.config.zipURL}`)
  logic.DownloadZipFile(conf.config);
  setInterval(() => logic.DownloadZipFile(conf.config), conf.config.zipDownloadIntervall * 1000);
}

server.listen(conf.config.httpPort, () => console.log(`Listening on port ${conf.config.httpPort} via http`));
if (conf.config.useSSL) {
  const sslPort = conf.config.sslPort;
  sslServer.listen(sslPort, () => console.log(`Listening on port ${sslPort} via https`));
}