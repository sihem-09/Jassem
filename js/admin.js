// Admin Panel JavaScript

const ADMIN_USERNAME = 'jassem235';
const ADMIN_PASSWORD = '87654321';

const loginCard = document.getElementById('loginCard');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const addNewBtn = document.getElementById('addNewBtn');
const portfolioList = document.getElementById('portfolioList');
const portfolioModal = document.getElementById('portfolioModal');
const portfolioForm = document.getElementById('portfolioForm');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('arteaAdmin') === 'true') {
        showAdminPanel();
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('arteaAdmin', 'true');
        loginError.style.display = 'none';
        showAdminPanel();
    } else {
        loginError.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('arteaAdmin');
    adminPanel.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
});

function showAdminPanel() {
    loginCard.style.display = 'none';
    adminPanel.style.display = 'block';
    loadPortfolioList();
}

function loadPortfolioList() {
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    
    if (portfolio.length === 0) {
        portfolioList.innerHTML = `
            <div style="text-align: center; padding: 48px; color: var(--text-secondary);">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>No portfolio items. Click "Add New" to create one.</p>
            </div>
        `;
        return;
    }
    
    portfolioList.innerHTML = portfolio.map(item => `
        <div class="portfolio-admin-item">
            <img src="${item.image}" alt="${item.titleEn}">
            <div class="portfolio-admin-details">
                <h4>${item.titleEn} / ${item.titleAr}</h4>
                <p>${item.categoryEn} / ${item.categoryAr}</p>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">ID: ${item.id}</p>
            </div>
            <div class="admin-actions">
                <button class="btn btn-outline btn-small" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

addNewBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add Portfolio Item';
    portfolioForm.reset();
    document.getElementById('editId').value = '';
    portfolioModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    portfolioModal.classList.remove('active');
});

portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
        portfolioModal.classList.remove('active');
    }
});

portfolioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    const editId = document.getElementById('editId').value;
    
    const itemData = {
        titleEn: document.getElementById('titleEn').value,
        titleAr: document.getElementById('titleAr').value,
        categoryEn: document.getElementById('categoryEn').value,
        categoryAr: document.getElementById('categoryAr').value,
        image: document.getElementById('imageUrl').value
    };
    
    if (editId) {
        const index = portfolio.findIndex(item => item.id === parseInt(editId));
        if (index !== -1) {
            portfolio[index] = { ...portfolio[index], ...itemData };
        }
    } else {
        const newId = portfolio.length > 0 ? Math.max(...portfolio.map(item => item.id)) + 1 : 1;
        portfolio.push({ id: newId, ...itemData });
    }
    
    localStorage.setItem('arteaPortfolio', JSON.stringify(portfolio));
    portfolioModal.classList.remove('active');
    loadPortfolioList();
    alert(editId ? '✓ Updated successfully!' : '✓ Added successfully!');
});

function editItem(id) {
    const portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    const item = portfolio.find(item => item.id === id);
    if (!item) return;
    
    modalTitle.textContent = 'Edit Portfolio Item';
    document.getElementById('editId').value = item.id;
    document.getElementById('titleEn').value = item.titleEn;
    document.getElementById('titleAr').value = item.titleAr;
    document.getElementById('categoryEn').value = item.categoryEn;
    document.getElementById('categoryAr').value = item.categoryAr;
    document.getElementById('imageUrl').value = item.image;
    portfolioModal.classList.add('active');
}

function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    let portfolio = JSON.parse(localStorage.getItem('arteaPortfolio')) || [];
    portfolio = portfolio.filter(item => item.id !== id);
    localStorage.setItem('arteaPortfolio', JSON.stringify(portfolio));
    loadPortfolioList();
    alert('✓ Deleted successfully!');
}

window.editItem = editItem;
window.deleteItem = deleteItem;