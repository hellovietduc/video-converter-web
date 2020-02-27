import Form from '../components/Form.js';
import StatusBar from '../components/StatusBar.js';

const Home = {
  render: async () => {
    const form = await Form.render();
    const statusBar = await StatusBar.render();
    const view = /*html*/ `
      <article>
        ${form}
        ${statusBar}
      </article>
    `;
    return view;
  },
  afterRender: async () => {
    await Form.afterRender();
    await StatusBar.afterRender();
  }
};

export default Home;
