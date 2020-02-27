const md5 = require('md5');
const fs = require('fs-extra');
const handbrake = require('handbrake-js');
const initializer = require('./initializer');
const cleanup = require('./cleanup');

const storage = {
  handbrakeInstances: new Map(),
  convertedFiles: new Map()
};

const emitter = initializer.getEmitter();

module.exports = (app, uploader, ENV) => {
  // Handle convert video requests
  app.post('/videos/upload', uploader.single('file'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ msg: 'File upload failed' });
      console.error('File upload failed: no file from uploader');
      return;
    }

    res.status(201).json({ msg: 'Request is being handled' });
    console.log('Request is being handled');

    try {
      // Prepare the input
      const [height, rate] = req.body.format.split(',');
      const item = { name: req.file.originalname, path: req.file.path, height, rate };
      const convertedFilename = item.name + '_converted.mp4';
      const hash = md5(convertedFilename);

      // Create a converter instance
      const instance = handbrake
        .spawn({
          input: item.path,
          output: `${ENV.CONVERTS_DIR}/${convertedFilename}`,
          encoder: 'x264', // HLS/H.264
          height: parseInt(item.height),
          width: item.height === '720' ? 1280 : 585,
          rate: parseInt(item.rate)
        })
        .on('error', err => {
          emitter.emit('error', { msg: 'Cannot spawn converter instance' });
          console.error(`Cannot spawn converter instance for file ${item.name}`);
          console.error(err);
        })
        .on('progress', progress => {
          emitter.emit('message', {
            status: 'converting',
            hash,
            filename: item.name,
            percentComplete: progress.percentComplete,
            eta: progress.eta
          });
        })
        .on('complete', () => {
          emitter.emit('message', { status: 'completed', hash });
          storage.handbrakeInstances.delete(hash);
          storage.convertedFiles.set(hash, `${ENV.CONVERTS_DIR}/${convertedFilename}`);
          console.log(`File convert finished: ${item.name} -> ${convertedFilename}`);

          // Delete uploaded file instantly
          fs.unlinkSync(`${ENV.UPLOADS_DIR}/${item.name}`);

          // Delete converted file after FILE_LIFETIME minutes
          setTimeout(() => {
            fs.unlinkSync(`${ENV.CONVERTS_DIR}/${convertedFilename}`);
            storage.convertedFiles.delete(hash);
            console.log(`Converted file deleted: ${convertedFilename}`);
          }, ENV.FILE_LIFETIME * 60 * 1000);
        });

      // Save the instance to an in-memory storage
      storage.handbrakeInstances.set(hash, instance);
      console.log(`File convert starts: ${item.name} -> ${convertedFilename}`);
    } catch (err) {
      emitter.emit('error', { msg: 'Request is invalid' });
      console.error('Request is invalid');
      console.error(err);
    }
  });

  // Handle download converted video requests
  app.get('/videos/:hash', (req, res) => {
    const { hash } = req.params;
    const path = storage.convertedFiles.get(hash);
    if (fs.existsSync(path)) {
      res.attachment(path).sendFile(path);
      console.log(`Sent file to client: ${path.slice(path.lastIndexOf('/') + 1)}`);
    } else {
      res.status(404).json({ msg: 'File not exist' });
      console.error(`File not exist: ${path}`);
    }
  });

  // Handle cancel convert video requests
  app.delete('/videos/:hash', (req, res) => {
    const { hash } = req.params;
    const instance = storage.handbrakeInstances.get(hash);
    if (instance) {
      instance.cancel();
      res.json({ msg: 'Video convert cancelled' });
      emitter.emit('message', { status: 'cancelled', hash });
      storage.handbrakeInstances.delete(hash);
      console.log(`File convert cancelled: ${hash}`);
      const path = storage.convertedFiles.get(hash);
      if (path) fs.unlinkSync(path);
    } else {
      res.status(404).json({ msg: 'File convert not exist' });
      console.error(`File convert not exist: ${hash}`);
    }
  });

  // SSE streaming
  app.get('/streaming', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store, no-cache',
      Connection: 'keep-alive'
    });

    res.write(`retry: 1000 \n\n`);

    emitter.on('error', err => {
      const obj = { error: err };
      res.write(`data: ${JSON.stringify(obj)} \n\n`);
    });

    emitter.on('message', msg => {
      const obj = { data: msg };
      res.write(`data: ${JSON.stringify(obj)} \n\n`);
    });
  });

  // Clean up stale files in UPLOADS_DIR & CONVERTS_DIR periodically
  cleanup(storage, ENV);
};
