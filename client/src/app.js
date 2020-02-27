'use strict';

import Home from './views/pages/Home.js';
import Header from './views/components/Header.js';

// The router code
const router = async () => {
  // Lazy load view elements
  const header = null || document.getElementById('header_container');
  const content = null || document.getElementById('page_container');

  // Render the header and the content of the page
  header.innerHTML = await Header.render();
  await Header.afterRender();

  content.innerHTML = await Home.render();
  await Home.afterRender();
};

// Listen on page load
window.addEventListener('load', router);

// Listen on hash change
window.addEventListener('hashchange', router);
