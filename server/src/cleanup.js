const fs = require('fs-extra');
const path = require('path');

const listFiles = dir => {
  return new Promise(resolve => {
    fs.readdir(dir)
      .then(files => files.map(file => path.normalize(`${dir}/${file}`)))
      .then(resolve)
      .catch(err => resolve([]));
  });
};

const getConvertedFiles = storage => {
  return Array.from(storage.convertedFiles.values());
};

const deleteFile = path => {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    // ignore
  }
};

module.exports = (storage, ENV) => {
  return setInterval(async () => {
    const filesInUploads = await listFiles(ENV.UPLOADS_DIR);
    for (const file of filesInUploads) {
      deleteFile(file);
    }

    const filesInConverts = await listFiles(ENV.CONVERTS_DIR);
    const convertedFiles = getConvertedFiles(storage);
    for (const file of filesInConverts) {
      if (!convertedFiles.includes(file)) {
        deleteFile(file);
      }
    }
  }, ENV.FILE_LIFETIME * 60 * 1000);
};
