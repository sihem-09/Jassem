// ARTEA Portfolio - Enhanced Main JavaScript

// Default portfolio data
const defaultPortfolio = [
    {
        id: 1,
        titleEn: 'Mona Lisa Reinterpretation',
        titleAr: 'إعادة تفسير الموناليزا',
        categoryEn: 'Oil Painting',
        categoryAr: 'رسم زيتي',
        image: 'images/img1.jpg'
    },
    {
        id: 2,
        titleEn: 'Lionel Messi - World Cup Champion',
        titleAr: 'ليونيل ميسي - بطل كأس العالم',
        categoryEn: 'Oil Painting',
        categoryAr: 'رسم زيتي',
        image: 'images/img2.jpg'
    },
    {
        id: 3,
        titleEn: 'Tea & Tradition',
        titleAr: 'الشاي والتقاليد',
        categoryEn: 'Oil Painting',
        categoryAr: 'رسم زيتي',
        image: 'images/img3.jpg'
    },
    {
        id: 4,
        titleEn: 'Historical Figures',
        titleAr: 'شخصيات تاريخية',
        categoryEn: 'Oil Painting',
        categoryAr: 'رسم زيتي',
        image: 'images/img4.jpg'
    },
    {
        id: 5,
        titleEn: 'Portrait Study',
        titleAr: 'دراسة بورتريه',
        categoryEn: 'Charcoal Drawing',
        categoryAr: 'رسم فحمي',
        image: 'images/img6.jpg'
    },
    {
        id: 6,
        titleEn: 'Arabic Calligraphy Mural',
        titleAr: 'جدارية خطية عربية',
        categoryEn: 'Graffiti',
        categoryAr: 'غرافيتي',
        image: 'images/img7.jpg'
    }
];

// Initialize localStorage
if (!localStorage.getItem('arteaPortfolio')) {
    localStorage.setItem('arteaPortfolio', JSON.stringify(defaultPortfolio));
}

// Current language
let currentLang = localStorage.getItem('arteaLang') || 'en';

// Current theme
let currentTheme = localStorage.getItem('arteaTheme') || 'light';

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const langButtons = document.querySelectorAll('.lang-btn');
const themeToggle = document.getElementById('themeToggle');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    switchLanguage(currentLang);
    loadPortfolio();
    setupScrollAnimations();
    setupNavbarScroll();
    setupContactForm();
    setupFAQ();
});

// Theme Toggle
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('arteaTheme', currentTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const slider = document.querySelector('.theme-toggle-slider');
    if (!slider) return;

    if (currentTheme === 'light') {
        slider.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        slider.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}


// Mobile Menu
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Language Switcher
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
    });
});

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('arteaLang', lang);
    
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    if (document.getElementById('portfolioGrid')) {
        loadPortfolio();
    }
}

// Load Portfolio
function loadPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || defaultPortfolio;
    const itemsToShow = portfolio.slice(0, 6);
    
    grid.innerHTML = itemsToShow.map(item => `
        <div class="portfolio-item fade-in">
            <img src="${item.image}" alt="${currentLang === 'ar' ? item.titleAr : item.titleEn}" loading="lazy">
            <div class="portfolio-overlay">
                <h3>${currentLang === 'ar' ? item.titleAr : item.titleEn}</h3>
                <p>${currentLang === 'ar' ? item.categoryAr : item.categoryEn}</p>
            </div>
        </div>
    `).join('');
    
    setTimeout(() => setupScrollAnimations(), 100);
}

// Scroll Animations
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => observer.observe(element));
}

// Navbar Scroll
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 20px var(--shadow)';
        } else {
            navbar.style.boxShadow = '0 2px 10px var(--shadow)';
        }
    });
}

// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQs
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked FAQ if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Contact Form with FormSubmit.co 
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        // Show loading
        btn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        btn.disabled = true;
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        try {
            // Using FormSubmit.co - a free form backend service
            const response = await fetch('https://formsubmit.co/ajax/doudijassem45@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    _subject: `New Portfolio Contact from ${data.name}`,
                    _template: 'table'
                })
            });
            
            if (response.ok) {
                // Show success message
                successMsg.style.display = 'block';
                form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Fallback to mailto if FormSubmit fails
            console.log('Using mailto fallback');
            const subject = encodeURIComponent(`Portfolio Inquiry from ${data.name}`);
            const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
            window.location.href = `mailto:doudijassem45@gmail.com?subject=${subject}&body=${body}`;
        } finally {
            // Reset button
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});