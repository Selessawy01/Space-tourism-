console.log('Hello, World!');


const navDom = {
    bodyScroll   : document.body,
    toggleBtn     : document.querySelector(".header__toggle"),
    navLinks      : document.querySelector(".nav"),
    closeIcon     : document.querySelector(".nav__close"),
};

const menu = {
    init(){
        if (!navDom.toggleBtn || !navDom.closeIcon) return;
        this.bindEvents();
    },

    bindEvents(){
        navDom.toggleBtn.addEventListener('click',()=> this.openMenu());
        navDom.closeIcon.addEventListener('click',()=>this.closeMenu());

        // close menu when nav link is clicked
        document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
        });

        // close when clicking outside nav
       document.addEventListener('click', (e) => {
       if (!navDom.navLinks.contains(e.target) && 
           !navDom.toggleBtn.contains(e.target)) {
             this.closeMenu();
            }
        });

        // close on escape
         document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    },

    openMenu(){
    if (!navDom.navLinks) return;
        navDom.navLinks.classList.add('is-open');
        navDom.navLinks.setAttribute('aria-hidden','false');
        navDom.bodyScroll.classList.add('menu-open');
        navDom.toggleBtn.setAttribute('aria-expanded','true');
        navDom.closeIcon.focus();

        // trap focus inside nav
        navDom.navLinks.addEventListener('keydown', this.trapFocus);
    },

    closeMenu(){
    if (!navDom.navLinks) return;
        navDom.navLinks.classList.remove('is-open');
        navDom.navLinks.setAttribute('aria-hidden','true');
        navDom.toggleBtn.setAttribute('aria-expanded','false');
        navDom.bodyScroll.classList.remove('menu-open');
        navDom.toggleBtn.focus();
        navDom.navLinks.removeEventListener('keydown', this.trapFocus);

    },
    trapFocus(e){
        const focusable = navDom.navLinks.querySelectorAll('button, a, [tabindex="0"]')
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus() // wrap to last
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
            first.focus() // wrap to first
            }
        }
},

};

function appInit(){
    menu.init();
}

document.addEventListener("DOMContentLoaded", appInit);
