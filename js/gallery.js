// Gallery Page JavaScript with Modal Support

document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupImageModal();
});

function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    const currentLang = localStorage.getItem('arteaLang') || 'en';
    
    if (portfolio.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 64px; grid-column: 1 / -1;">
                <h3 style="color: var(--text-secondary);">
                    ${currentLang === 'ar' ? 'لا توجد أعمال متاحة' : 'No artworks available'}
                </h3>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = portfolio.map((item, index) => `
        <div class="masonry-item fade-in" data-index="${index}">
            <img src="${item.image}" alt="${currentLang === 'ar' ? item.titleAr : item.titleEn}" loading="lazy">
        </div>
    `).join('');
    
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => observer.observe(element));
    }, 100);
}

function setupImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    let currentIndex = 0;
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    const currentLang = localStorage.getItem('arteaLang') || 'en';
    
    document.addEventListener('click', (e) => {
        const masonryItem = e.target.closest('.masonry-item');
        if (masonryItem) {
            currentIndex = parseInt(masonryItem.getAttribute('data-index'));
            openModal();
        }
    });
    
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateContent();
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateContent() {
        const item = portfolio[currentIndex];
        if (item) {
            document.getElementById('modalImage').src = item.image;
            document.getElementById('modalTitle').textContent = currentLang === 'ar' ? item.titleAr : item.titleEn;
            document.getElementById('modalCategory').textContent = currentLang === 'ar' ? item.categoryAr : item.categoryEn;
        }
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    if (modalPrev) {
        modalPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + portfolio.length) % portfolio.length;
            updateContent();
        });
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % portfolio.length;
            updateContent();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') modalPrev.click();
        if (e.key === 'ArrowRight') modalNext.click();
    });
}