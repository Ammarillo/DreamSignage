const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const path = require('path');
const conf = require("config");
const server = require('http').Server(app);
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
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');
const crypto = require('crypto');

const folder = './public/content/';
let fileList = [];
let fileHashes = {}; // To store the previous hash of each file

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

if (conf.config.useSSL) {
  app.use(requireHTTPS);
}

app.get('/', (req, res) => res.render('content'));

io.on('connection', handleSocketConnection);

setInterval(UpdateContent, conf.config.scanIntervall * 1000);

if (conf.config.useZipDownload) {
  console.log(`Using ${conf.config.zipURL}`)
  DownloadZipFile();
  setInterval(DownloadZipFile, conf.config.zipDownloadIntervall * 1000);
}

server.listen(conf.config.httpPort, () => console.log(`Listening on port ${conf.config.httpPort} via http`));
if (conf.config.useSSL) {
  const sslPort = conf.config.sslPort;
  sslServer.listen(sslPort, () => console.log(`Listening on port ${sslPort} via https`));
}

function handleSocketConnection(socket) {
  socket.emit("filelist", fileList);
  socket.emit("settings", {
    contentIntervall: conf.config.contentIntervall,
    backgroundColor: conf.config.backgroundColor
  });

  socket.on('requpdate', () => {
    socket.emit("filelist", fileList);
    socket.emit("settings", {
      contentIntervall: conf.config.contentIntervall
    });
  });
}

function requireHTTPS(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

function UpdateContent() {
  const files = fs.readdirSync(folder);
  const validExtensions = ['.pdf', '.mp4', '.webm', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

  const newFileHashes = {};

  files.forEach(file => {
    const filePath = path.join(folder, file);
    const isFile = fs.lstatSync(filePath).isFile();
    const isValidExtension = validExtensions.some(ext => file.endsWith(ext));

    if (isFile && isValidExtension) {
      newFileHashes[file] = computeFileHash(filePath);
    }
  });

  const hasChanges = 
    Object.keys(newFileHashes).length !== Object.keys(fileHashes).length || // Different number of files
    Object.keys(newFileHashes).some(fileName => newFileHashes[fileName] !== fileHashes[fileName]); // Different file content

  fileList = Object.keys(newFileHashes); // Update the fileList
  fileHashes = newFileHashes; // Update the stored hashes for the next comparison

  if (hasChanges) {
    console.log("Last Check: " + new Date());
    console.log("Content changed!");
    console.log(fileList);
    io.emit("update", {});
  }
}

function DownloadZipFile() {
  downloadAndExtractZip(conf.config.zipURL, folder)
    .then(() => {})
    .catch(err => console.error('Error:', err));
}

function computeFileHash(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileContent);
  return hash.digest('hex');
}

async function computeSHA256(filePath) {
  return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const input = fs.createReadStream(filePath);

      input.on('readable', () => {
          const data = input.read();
          if (data) {
              hash.update(data);
          } else {
              resolve(hash.digest('hex'));
          }
      });

      input.on('error', reject);
  });
}

async function downloadAndExtractZip(url, outputPath) {
  const response = await fetch(url);
  const buffer = await response.buffer();

  // Check if directory exists
  if (!fs.existsSync(`./public/download/`)) {
    // If not, create the directory
    fs.mkdirSync(path, { recursive: true });
  }

  const zipPath = `./public/download/temp.zip`;
  fs.writeFileSync(zipPath, buffer);

  const currentHash = await computeSHA256(zipPath);
  let previousHash = null;

  const hashFilePath = `./public/download/hash.txt`;
  if (fs.existsSync(hashFilePath)) {
      previousHash = fs.readFileSync(hashFilePath, 'utf8');
  }

  if (previousHash === currentHash) {
      //console.log('The ZIP file is the same as before.');
      fs.unlinkSync(zipPath);
      return;
  } else {
    console.log('ZIP file content changed!');
  }

  if (!conf.config.keepFiles) deleteAllFilesFromFolder('./public/content');

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputPath, true);

  fs.writeFileSync(hashFilePath, currentHash);
  fs.unlinkSync(zipPath);
}

function deleteAllFilesFromFolder(directoryPath) {
  // Read the directory contents
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = fs.statSync(filePath);

      // Check if it's a file and delete
      if (fileStats.isFile()) {
          fs.unlinkSync(filePath);
          console.log(`Deleted: ${filePath}`);
      } else {
          console.warn(`Skipped (not a file): ${filePath}`);
      }
  }
}

function deleteLastLines(linesToDelete) {
  for (let i = 0; i < linesToDelete; i++) {
      process.stdout.moveCursor(0, -1); // move up one line
      process.stdout.clearLine(1); // clear line to the right of the cursor
  }
}