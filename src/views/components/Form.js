import interaction from '../../services/interaction.js';

const Form = {
  render: async () => {
    const view = /*html*/ `
      <div>
        <label>
          <b>Select Video File:</b>
        </label>
        <input id="file" type="file" name="file" accept="video/*|mkv|3gp|flv" />
        <label>
          <b>Convert to:</b>
        </label>
        <select id="format">
          <option value="720,60">720p @ 60fps HLS/H.264</option>
          <option value="720,30">720p @ 30fps HLS/H.264</option>
          <option value="480,30">480p @ 30fps HLS/H.264</option>
        </select>
        <button id="start-btn" type="button">Start</button>
        <button id="reset-btn" type="button">Reset</button>
      </div>
    `;
    return view;
  },
  afterRender: async () => {
    const startBtn = null || document.getElementById('start-btn');
    const resetBtn = null || document.getElementById('reset-btn');
    const file = null || document.getElementById('file');
    const format = null || document.getElementById('format');

    startBtn.onclick = interaction.onClickStartBtn(file, format);
    resetBtn.onclick = () => location.reload();
  }
};

export default Form;
