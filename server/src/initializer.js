const express = require('express');
const cors = require('cors');
const EvenEmitter = require('events');
const multer = require('multer');

const videoRegex = new RegExp('video');

module.exports.configExpress = app => {
  app.use(cors());
  app.use(express.json());
  app.disable('x-powered-by');
};

module.exports.getEmitter = () => {
  const emitter = new EvenEmitter();
  emitter.setMaxListeners(0);
  return emitter;
};

module.exports.getUploader = UPLOADS_DIR => {
  const uploader = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, UPLOADS_DIR),
      filename: (req, file, cb) => cb(null, file.originalname)
    }),
    fileFilter: (req, file, cb) => {
      cb(null, videoRegex.test(file.mimetype) || file.originalname.endsWith('.mkv'));
    }
  });
  return uploader;
};
