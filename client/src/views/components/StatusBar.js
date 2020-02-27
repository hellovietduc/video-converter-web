import interaction from '../../services/interaction.js';
import { SERVER_URL } from '../../config/index.js';

const StatusBar = {
  render: async () => {
    const view = /*html*/ `
      <div>
        <div id="message"></div>
        <div id="action"></div>
      </div>
    `;
    return view;
  },
  afterRender: async () => {
    const message = null || document.getElementById('message');
    const action = null || document.getElementById('action');
    let isConverting;

    const handle = {
      error: err => {
        if (!err.msg) return;
        isConverting = null;
        message.textContent = err.msg;
        action.innerHTML = '';
      },

      converting: file => {
        if (!file.hash) return;
        if (isConverting === undefined) isConverting = true;
        if (isConverting === true) {
          message.innerHTML = /*html*/ `
            Progress: <b>${file.percentComplete}%</b> -
            Time left: <b>${file.eta === '' ? 'calculating' : file.eta}</b>
          `;
          action.innerHTML = /*html*/ `
            <button type="button" id="cancel-btn">Cancel</button>
          `;

          const cancelBtn = null || document.getElementById('cancel-btn');
          cancelBtn.onclick = interaction.onClickCancelBtn(file.hash);
        }
      },

      completed: file => {
        if (!file.hash) return;
        isConverting = null;
        message.textContent = '';
        action.innerHTML = /*html*/ `
          <a href="${SERVER_URL}/videos/${file.hash}">Download</a> (expired in 5 minutes)
        `;
      },

      cancelled: () => {
        isConverting = null;
        message.textContent = 'Cancelled';
        action.innerHTML = '';
      }
    };

    interaction.registerOnMessage(handle);
  }
};

export default StatusBar;
