const extensionContainer = document.querySelector('.extension-container');

// All extensions form data.json file
function getExtensions() {
  return (
    JSON.parse(localStorage.getItem('extensions')) || [
      {
        logo: './assets/images/logo-devlens.svg',
        name: 'DevLens',
        description:
          'Quickly inspect page layouts and visualize element boundaries.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-style-spy.svg',
        name: 'StyleSpy',
        description: 'Instantly analyze and copy CSS from any webpage element.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-speed-boost.svg',
        name: 'SpeedBoost',
        description:
          'Optimizes browser resource usage to accelerate page loading.',
        isActive: false,
      },
      {
        logo: './assets/images/logo-json-wizard.svg',
        name: 'JSONWizard',
        description:
          'Formats, validates, and prettifies JSON responses in-browser.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-tab-master-pro.svg',
        name: 'TabMaster Pro',
        description: 'Organizes browser tabs into groups and sessions.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-viewport-buddy.svg',
        name: 'ViewportBuddy',
        description:
          'Simulates various screen resolutions directly within the browser.',
        isActive: false,
      },
      {
        logo: './assets/images/logo-markup-notes.svg',
        name: 'Markup Notes',
        description:
          'Enables annotation and notes directly onto webpages for collaborative debugging.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-grid-guides.svg',
        name: 'GridGuides',
        description:
          'Overlay customizable grids and alignment guides on any webpage.',
        isActive: false,
      },
      {
        logo: './assets/images/logo-palette-picker.svg',
        name: 'Palette Picker',
        description: 'Instantly extracts color palettes from any webpage.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-link-checker.svg',
        name: 'LinkChecker',
        description: 'Scans and highlights broken links on any page.',
        isActive: true,
      },
      {
        logo: './assets/images/logo-dom-snapshot.svg',
        name: 'DOM Snapshot',
        description: 'Capture and export DOM structures quickly.',
        isActive: false,
      },
      {
        logo: './assets/images/logo-console-plus.svg',
        name: 'ConsolePlus',
        description:
          'Enhanced developer console with advanced filtering and logging.',
        isActive: true,
      },
    ]
  );
}

function saveExtension(ext) {
  localStorage.setItem('extensions', JSON.stringify(ext));
}

let currentTab = 'all';

// Render extensions
function renderExtension(exts) {
  extensionContainer.innerHTML = '';

  if (exts.length <= 0) {
    const div = document.createElement('div');
    div.classList.add('empty-page')
    div.innerHTML = `
    <div>
      <span>There is no extension left.</span>
      <span>Get extensions...?</span>
      <button>Get now</button>
    </div>`;
    
    const getNewExtBtn = div.querySelector('.empty-page button');
    getNewExtBtn.addEventListener('click', () => {
      console.log(getNewExtBtn);
      localStorage.removeItem('extensions');
      const btn = document.querySelector(`[data-current-tab="${currentTab}"]`);
      btn.click()
    });

    requestAnimationFrame(() => {
      div.querySelector('div').classList.add('appear')
    })

    extensionContainer.appendChild(div)
  }

  exts.forEach((obj, index) => {
    const logo = obj.logo;
    const name = obj.name;
    const description = obj.description;
    const isActive = obj.isActive;
    const id = name.toLowerCase().replace(/\s+/g, '-');

    const div = document.createElement('div');
    div.classList.add('each-extension');
    div.innerHTML = `
    <div>
      <img src="${logo}" alt="">
      <div>
        <h2>${name}</h2>
        <p>${description}</p>
      </div>
    </div>

    <div>
      <button data-toast-message="${name} removed !" onclick="removeExtensions('${name}')" class="remove-btn">Remove</button>
      <label class="extension-toggle-label" for="${id}">
        <input onchange="toggleExtension('${name}')" ${
      isActive ? 'checked' : ''
    } type="checkbox" id="${id}">
        <div class="extension-toggle-btn"></div>
      </label>
    </div>`;

    requestAnimationFrame(() => {
      setTimeout(() => {
        div.classList.add('appear');
      }, 50 * index);
    });

    extensionContainer.appendChild(div);
  });
}
renderExtension(getExtensions());

// Tab change programs
const allNavBtn = document.querySelectorAll('.nav-btn');

let reRenderTimeout;
// let currentTab = 'all';

function filterExtensions(tab) {
  clearTimeout(reRenderTimeout);
  currentTab = tab;
  if (tab === 'active') {
    renderExtension(getExtensions().filter((ext) => ext.isActive));
    return;
  }
  if (tab === 'inactive') {
    renderExtension(getExtensions().filter((ext) => !ext.isActive));
    return;
  }
  if (tab === 'all') {
    renderExtension(getExtensions());
  }
}

allNavBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.currentTab;
    filterExtensions(tab);

    allNavBtn.forEach((btn) => btn.classList.remove('selected'));

    btn.classList.add('selected');
  });
});

// Turn on/off extensions program
function toggleExtension(name) {
  clearTimeout(reRenderTimeout);
  const savedExt = getExtensions();
  const extensionIndex = savedExt.findIndex((ext) => ext.name === name);
  if (extensionIndex !== -1) {
    savedExt[extensionIndex].isActive = !savedExt[extensionIndex].isActive;
    saveExtension(savedExt);
  }
  reRenderTimeout = setTimeout(() => {
    filterExtensions(currentTab);
  }, 1500);
}

// Remove extensions from the list
function removeExtensions(name) {
  clearTimeout(reRenderTimeout);
  const savedExt = getExtensions();
  const index = savedExt.findIndex((ext) => ext.name === name);
  if (index !== -1) {
    savedExt.splice(index, 1);
    saveExtension(savedExt);
    console.log(`${name} removed`);
  }
  reRenderTimeout = setTimeout(() => {
    filterExtensions(currentTab);
  }, 1000);
}

// ! remove confirmation message
const toastMessageContainer = document.querySelector(
  '.toast-message-container'
);
extensionContainer.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-toast-message]');
  if (removeBtn) {
    const message = removeBtn.dataset.toastMessage;
    const div = document.createElement('div');
    div.innerHTML = `<span>${message}</span>`;

    requestAnimationFrame(() => {
      div.classList.add('drop-it');
      setTimeout(() => {
        div.classList.remove('drop-it');
      }, 1800);
    });

    setTimeout(() => {
      toastMessageContainer.removeChild(div);
    }, 2100);

    toastMessageContainer.prepend(div);
  }
});

// ! Theme switch programs
function sunIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22" class="theme-toggle-svg">
  <g clip-path="url(#a)">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.98"
      d="M11 1.833v1.834m0 14.666v1.834M3.667 11H1.833m3.955-5.212L4.492 4.492m11.72 1.296 1.297-1.296M5.788 16.215l-1.296 1.296m11.72-1.296 1.297 1.296M20.167 11h-1.834m-2.75 0a4.583 4.583 0 1 1-9.167 0 4.583 4.583 0 0 1 9.167 0Z" />
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h22v22H0z" />
    </clipPath>
  </defs>
</svg>`;
}
function moonIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22" class="theme-toggle-svg">
  <g clip-path="url(#a)">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.98"
      d="M20.125 11.877A7.333 7.333 0 1 1 10.124 1.875a9.168 9.168 0 1 0 10.001 10.002Z" />
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h22v22H0z" />
    </clipPath>
  </defs>
</svg>`;
}
function updateThemeIcon(theme) {
  themeToggleBtn.innerHTML = '';
  themeToggleBtn.innerHTML = `${theme === 'light' ? moonIcon() : sunIcon()}`;
  const svg = themeToggleBtn.querySelector('.theme-toggle-svg');
  requestAnimationFrame(() => {
    svg.classList.add('icon-transition');
  });
}

const html = document.documentElement;
const themeToggleBtn = document.querySelector('.theme-toggle');

function getSavedTheme() {
  return localStorage.getItem('theme');
}
function getPreferedTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const theme = html.getAttribute('data-theme');
  const next = theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

themeToggleBtn.addEventListener('click', toggleTheme);

//load theme on page load
function loadSavedTheme() {
  if (getSavedTheme()) {
    applyTheme(getSavedTheme());
  } else {
    applyTheme(getPreferedTheme() ? 'dark' : 'light');
  }
}
loadSavedTheme();

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', loadSavedTheme);
