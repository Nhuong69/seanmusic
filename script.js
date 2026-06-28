const form = document.getElementById('contactForm');
const messageBox = document.getElementById('formMessage');
const progressBar = document.querySelector('.scroll-progress');
const navLinks = Array.from(document.querySelectorAll('nav a'));
const revealItems = document.querySelectorAll('.reveal');
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');
const heroCard = document.querySelector('.hero-card');
const body = document.body;

const syncProgress = () => {
    if (!progressBar) {
        return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
};

const syncActiveNav = () => {
    const sections = ['trang-chu', 'gioi-thieu', 'san-pham', 'blog', 'lien-he'];
    let activeId = 'trang-chu';

    for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (!section) {
            continue;
        }

        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
            activeId = sectionId;
            break;
        }
    }

    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === '#' + activeId;
        link.classList.toggle('active', isActive);
    });
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealItems.forEach((item) => revealObserver.observe(item));

const startPageTransition = () => {
    body.classList.add('is-ready');
};

const navigateWithFade = (targetUrl) => {
    body.classList.add('is-leaving');
    window.setTimeout(() => {
        window.location.href = targetUrl;
    }, 180);
};

startPageTransition();

const applyParallax = (event) => {
    if (!heroVisual || !heroCard || !hero) {
        return;
    }

    const rect = hero.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;

    heroVisual.style.transform = 'perspective(1000px) rotateY(' + (deltaX * 6) + 'deg) rotateX(' + (-deltaY * 5) + 'deg) translateY(-2px)';
    heroCard.style.transform = 'perspective(1000px) rotateY(' + (deltaX * -3) + 'deg) rotateX(' + (deltaY * 2.5) + 'deg)';
};

const resetParallax = () => {
    if (heroVisual) {
        heroVisual.style.transform = '';
    }

    if (heroCard) {
        heroCard.style.transform = '';
    }
};

syncProgress();
syncActiveNav();
window.addEventListener('scroll', () => {
    syncProgress();
    syncActiveNav();
}, { passive: true });
window.addEventListener('resize', syncProgress);

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');

        if (!href || href.startsWith('http') || href.includes('#')) {
            return;
        }

        if (href === window.location.pathname.split('/').pop()) {
            return;
        }

        event.preventDefault();
        navigateWithFade(href);
    });
});

if (hero && heroVisual && heroCard) {
    hero.addEventListener('mousemove', applyParallax);
    hero.addEventListener('mouseleave', resetParallax);
}

if (form && messageBox) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = form.name.value.trim();
        const phone = form.phone.value.trim();

        if (!name || !phone) {
            messageBox.textContent = 'Vui lòng nhập tên và số điện thoại.';
            messageBox.classList.add('show');
            return;
        }

        messageBox.textContent = 'Cảm ơn ' + name + '. Shop sẽ liên hệ lại sớm nhất.';
        messageBox.classList.add('show');
        form.reset();
    });
}