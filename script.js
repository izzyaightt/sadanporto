// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// Mobile menu functionality
const createMobileMenu = () => {
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.setAttribute('aria-label', 'Menu');
    hamburger.innerHTML = '<span class="bar"></span>';
    
    // Add hamburger to nav
    const nav = document.querySelector('nav');
    nav.appendChild(hamburger);

    // Menu functionality
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Add animation class to nav links
        const links = navLinks.querySelectorAll('li');
        links.forEach((link, index) => {
            if (isMenuOpen) {
                link.style.transitionDelay = `${0.2 + index * 0.1}s`;
            } else {
                link.style.transitionDelay = '0s';
            }
        });
    };

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !nav.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });
};

// Initialize mobile menu
createMobileMenu();

// Update the Scroll Animation Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add show class when element enters viewport
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            // Remove show class when element leaves viewport
            entry.target.classList.remove('show');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-50px'  // Adds a small buffer before animation triggers
});

// Add hidden class to all elements we want to animate
document.querySelectorAll('.project-card, .service-card, .about-content, .experience, .hero-content h1, .hero-content h2, .hero-content h3, .hero-description, .social-links, .work h2, .services h2, .about h2, .contact h2').forEach(element => {
    element.classList.add('hidden');
    observer.observe(element);
});

// Add stagger effect for grid children
document.querySelectorAll('.projects-grid, .services-grid').forEach(grid => {
    observer.observe(grid);
    grid.querySelectorAll('.project-card, .service-card').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Animate numbers in experience section
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger number animation when experience section is in view
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.exp-item h4').forEach(counter => {
                const target = parseInt(counter.textContent);
                animateValue(counter, 0, target, 2000);
            });
            experienceObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

const experienceSection = document.querySelector('.experience');
if (experienceSection) {
    experienceObserver.observe(experienceSection);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    hero.style.transform = `translateY(${scrolled * 0.4}px)`;
});

// Smooth reveal for nav on scroll up
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
});

// Add this at the beginning of your script.js
const initLoadingScreen = () => {
    const hellos = [
        { text: "Hello", language: "English" },
        { text: "你好", language: "Chinese" },
        { text: "こんにちは", language: "Japanese" },
        { text: "안녕하세요", language: "Korean" },
        { text: "Bonjour", language: "French" },
        { text: "Hola", language: "Spanish" },
        { text: "Ciao", language: "Italian" },
        { text: "Hallo", language: "German" },
        { text: "Olá", language: "Portuguese" },
        { text: "Привет", language: "Russian" },
        { text: "مرحبا", language: "Arabic" },
        { text: "Hej", language: "Swedish" },
        { text: "Halo", language: "Indonesian" }
    ];

    const loadingScreen = document.querySelector('.loading-screen');
    const helloText = document.querySelector('.hello-text');
    let currentIndex = 0;

    // Add loading class to body
    document.body.classList.add('loading');

    // Function to update hello text with fade effect
    const updateHelloText = () => {
        helloText.style.opacity = '0';
        setTimeout(() => {
            helloText.textContent = hellos[currentIndex].text;
            helloText.style.opacity = '1';
            currentIndex = (currentIndex + 1) % hellos.length;
        }, 400);
    };

    // Initial hello text
    updateHelloText();

    // Change hello text every 800ms
    const textInterval = setInterval(updateHelloText, 800);

    // Hide loading screen after 4 seconds
    setTimeout(() => {
        clearInterval(textInterval);
        // Show the final "Hello" in English for a moment before hiding
        helloText.textContent = "Hello";
        helloText.style.opacity = '1';
        
        setTimeout(() => {
            loadingScreen.classList.add('hide');
            document.body.classList.remove('loading');

            // Remove loading screen from DOM after animation
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);

            // Trigger initial animations after loading
            initializePageAnimations();
        }, 1000);
    }, 4000);
};

// Update the CSS for smoother transitions
const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .hello-text {
            transition: opacity 0.4s ease-in-out !important;
        }
        
        .loading-screen {
            transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out !important;
        }
    `;
    document.head.appendChild(style);
};

// Call the style updates
addStyles();

// Update the page animations to be slower
const initializePageAnimations = () => {
    document.querySelectorAll('.hero-content > *').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, index * 300);
    });
};

// Call loading screen on page load
document.addEventListener('DOMContentLoaded', initLoadingScreen); 