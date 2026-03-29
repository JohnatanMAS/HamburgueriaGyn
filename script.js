console.log("JS carregou!");

const navLinks = document.querySelectorAll('header nav a');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

// Toggle menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Clique nos links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');

        // Fecha o menu
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }

        // Scroll suave
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Clique fora fecha o menu
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
    }
});