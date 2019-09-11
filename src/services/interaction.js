import { SERVER_URL, API } from '../config/index.js';

const es = new EventSource(SERVER_URL + '/streaming');

const interaction = {
  onClickStartBtn: (file, format) => {
    let isConverting = false;
    return () => {
      if (isConverting) return;
      isConverting = true;

      const formData = new FormData();
      formData.append('file', file.files[0]);
      formData.append('format', format.value);
      API.post(SERVER_URL + '/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.msg) {
            // message.textContent = err.response.data.msg;
            // TODO: send to StatusBar to display
            console.log(err.response.data.msg);
          }
        })
        .finally(() => {
          isConverting = false; // TODO: set this to true when convert is done
        });
    };
  },

  onClickCancelBtn: hash => () => {
    API.delete(`${SERVER_URL}/videos/${hash}`).catch(err => {
      if (err.response && err.response.data && err.response.data.msg) {
        // message.textContent = err.response.data.msg;
        // TODO: send to StatusBar to display
        console.log(err.response.data.msg);
      }
    });
  },

  registerOnMessage: handle => {
    es.onmessage = msg => {
      if (!msg.data) return;

      const obj = JSON.parse(msg.data);
      if (!obj) return;

      const { error, data } = obj;

      if (error) {
        handle.error(error);
      } else if (data) {
        if (handle[data.status]) handle[data.status](data);
      }
    };
  }
};

export default interaction;
