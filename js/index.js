// 1. fetch data once, use everywhere
let data = {};


// 2. fetches data.json and stores in data variable
async function fetchData() {
  const response = await fetch('./data.json');
  data = await response.json();
}

// 3. selects all page sections and nav links
const pages       = document.querySelectorAll('.page');
const navLinks    = document.querySelectorAll('.nav__link');
const exploreBtn  = document.querySelector('.intro__button');

const pageLoaders = {
  'destination-page': loadDestination,
  'crew-page'       : loadCrew,
  'technology-page' : loadTechnology,
};

// 4. hides all pages, shows only target page also swaps background and active nav link
function showPage(pageId) {
  console.log("home-page",pageId);

  pages.forEach(p => p.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');

  document.body.className = pageId;
  navLinks.forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

// 5. nav link clicks trigger page switch + load correct data

function handleNavClick(e) {

  e.preventDefault();
  const target = e.currentTarget.dataset.page;
  
  showPage(target);
  // call the matching load function if one exists
  if (pageLoaders[target]) {pageLoaders[target](0);
  }
}


// 6.A : builds destination content from JSON
function loadDestination(index) {
  const dest = data.destinations[index];
  
  // updates image
  document.querySelector('.planet-img').src = dest.images.webp;
  document.querySelector('.planet-img').alt = dest.name;

  // builds article content with template literals
  document.querySelector('.destination__info').innerHTML = `
    <h2 class=" destination__name heading-lg uppercase">${dest.name}</h2>
    <p class="destination__description text-sm">${dest.description}</p>
    <div class="destination__border"></div>
    <div class="destination__stats">
      <div class="destination__distance">
        <p class="destination__distance-title uppercase">Avg. distance</p>
        <p class="destination__distance-value uppercase">${dest.distance}</p>
      </div>
      <div class="destination__time">
        <p class="destination__time-title uppercase">Est. travel time</p>
        <p class="destination__time-value uppercase">${dest.travel}</p>
      </div>
    </div>
  `;

   // builds tab buttons dynamically from JSON array
  const tabsContainer     = document.querySelector('.destination__tabs');
  tabsContainer.innerHTML = data.destinations.map((d, i) => `
    <button class="destination__tab-btn uppercase ${i === index ? 'active' : ''}"
            data-index="${i}"
            role="tab"
            aria-selected="${i === index}"
            tabindex="${i === index ? '0' : '-1'}">
      ${d.name}
    </button>
  `).join('');

  // tab click events
  document.querySelectorAll('.destination__tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadDestination(parseInt(btn.dataset.index));
    });
  });
  attachKeyboardNav('.destination__tab-btn', loadDestination);
}

// 6.B: builds Crew content from JSON
function loadCrew(index) {
  const crew = data.crew[index];

  document.querySelector('.crew__info').innerHTML =  `
    <p  class="crew__role text-md uppercase">${crew.role}</p>
    <h2 class="crew__name heading-md uppercase">${crew.name}</h2>
    <p  class="crew__bio text-sm">${crew.bio}</p>
    `
  const tabsContainer     = document.querySelector('.crew__tabs');
  tabsContainer.innerHTML = data.crew.map((c, i)=> `
      <button class = "crew__tab-btn  ${i === index ? 'active' : ''}" 
                      data-index="${i}"
                      data-image ="${c.name.toLowerCase().replace(' ', '-')}"
                      
                      role = "tab"
                      id = "tab-btn-${i+1}"
                      aria-controls = "tab1"
                      aria-selected ="${i === index}"
                      tabindex = "${i === index ? '0' : '-1'}"
                      aria-label="${c.role} ${c.name}">
              </button>
  ` ).join('');

  document.querySelector('.crew__image').src = crew.images.webp;
  document.querySelector('.crew__image').alt = crew.name;

  // attach click events
  document.querySelectorAll('.crew__tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadCrew(parseInt(btn.dataset.index));
    });
  });
  attachKeyboardNav('.crew__tab-btn', loadCrew);
}

// 6.C : builds Technology content from JSON
function loadTechnology(index) {
  const tech = data.technology[index];

  document.querySelector('picture source').srcset  = tech.images.portrait;
  document.querySelector('.technology__image').src = tech.images.landscape;
  document.querySelector('.technology__image').alt = tech.name;

  document.querySelector('.technology__tabs').innerHTML =
    data.technology.map((t, i) => `
      <button class="technology__tab-btn text-md ${i === index ? 'active' : ''}"
              data-index="${i}"
              role="tab"
              aria-selected="${i === index}"
              tabindex="${i === index ? '0' : '-1'}">
        ${i + 1}
      </button>
    `).join('');

  document.querySelector('.technology__info').innerHTML = `
    <p class="technology__role text-md uppercase">The terminology...</p>
    <h2 class="technology__name heading-md uppercase">${tech.name}</h2>
    <p class="technology__bio text-sm">${tech.description}</p>
  `;

  

  document.querySelectorAll('.technology__tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadTechnology(parseInt(btn.dataset.index));
    });
  });

  attachKeyboardNav('.technology__tab-btn', loadTechnology);
}


// 6.D: attach keyboard navigation to tab buttons

function attachKeyboardNav(selector, loadFn) {
  const tabs = document.querySelectorAll(selector);

  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();

        const nextIndex =
          index + 1 < tabs.length ? index + 1 : 0;

        loadFn(nextIndex);

        document.querySelectorAll(selector)[nextIndex].focus();
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();

        const previousIndex =
          index - 1 >= 0 ? index - 1 : tabs.length - 1;

        loadFn(previousIndex);

        document.querySelectorAll(selector)[previousIndex].focus();
      }
    });
  });
}

// 7. Group all event binding here
function bindEvents() {

  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  exploreBtn.addEventListener('click', handleNavClick);
}


// 8. fetches data then shows home page on load
async function appInit() {
  await fetchData();
  bindEvents();
  showPage('home-page');

}

document.addEventListener('DOMContentLoaded', appInit);