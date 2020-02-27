const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const initializer = require('./initializer');
const route = require('./router');

// Set up env variables
const PORT = process.env.PORT;
const DIRNAME = __dirname.substring(0, __dirname.lastIndexOf('/'));
const UPLOADS_DIR = path.normalize(`${DIRNAME}/uploads`);
const CONVERTS_DIR = path.normalize(`${DIRNAME}/converts`);
const FILE_LIFETIME = parseInt(process.env.FILE_LIFETIME);

// Create the server
const app = express();
const server = http.createServer(app);
initializer.configExpress(app);

// Create the uploader
const uploader = initializer.getUploader(UPLOADS_DIR);

// Empty uploads & converts directories at startup
fs.emptyDirSync(UPLOADS_DIR);
fs.emptyDirSync(CONVERTS_DIR);

// Handle app routers
route(app, uploader, { PORT, DIRNAME, UPLOADS_DIR, CONVERTS_DIR, FILE_LIFETIME });

server.listen(PORT, () => console.log('server running on port ' + PORT));
