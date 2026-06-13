// DOM Content Loaded - Premium preloader with immediate hide
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen immediately on DOM ready
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    
    // Complete hide after transition
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 800);
    
    initializeWebsite();
});

function initializeWebsite() {
    // Render treatments
    renderTreatments();

    // Initialize slider
    initSlider();

    // Initialize hamburger menu
    initHamburgerMenu();

    // Set minimum date for booking
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Initialize scroll animations
    initScrollAnimations();
}

// SPA Navigation - Show/hide page views
function navigateTo(viewName) {
    // Hide all page views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // Close mobile menu if open
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.classList.remove('hamburger-active');
        mobileMenu.classList.add('hidden');
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render treatments grid
function renderTreatments() {
    const grid = document.getElementById('treatments-grid');
    const treatments = getAllTreatments();
    
    grid.innerHTML = '';
    
    treatments.forEach((treatment, index) => {
        const card = document.createElement('div');
        card.className = 'treatment-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${treatment.image}" alt="${treatment.name}" class="treatment-image" loading="lazy">
            <div class="treatment-info">
                <span class="treatment-category">${capitalizeCategory(treatment.category)}</span>
                <h3 class="treatment-name">${treatment.name}</h3>
                <p class="treatment-desc">${treatment.description.substring(0, 100)}...</p>
                <button class="treatment-btn" onclick="showTreatmentDetails(${treatment.id})">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Trigger animation
    setTimeout(() => {
        document.querySelectorAll('.treatment-card').forEach(card => {
            card.classList.add('animate');
        });
    }, 100);
}

// Helper to capitalize category
function capitalizeCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Show treatment details in SPA page view
function showTreatmentDetails(id) {
    const treatment = getTreatmentById(id);
    if (!treatment) return;
    
    const container = document.getElementById('treatment-details-content');
    container.innerHTML = `
        <img src="${treatment.image}" alt="${treatment.name}" class="treatment-details-image" loading="lazy">
        <span class="treatment-details-category">${capitalizeCategory(treatment.category)}</span>
        <h3 class="treatment-details-name">${treatment.name}</h3>
        <p class="treatment-details-desc">${treatment.description}</p>
        <h4 class="treatment-features-title">Key Features:</h4>
        <ul class="treatment-details-features">
            ${treatment.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <button class="treatment-details-book-btn" onclick="openBookingForTreatment('${treatment.name}')">Book Now</button>
    `;
    
    navigateTo('treatment-details');
}

// Open booking modal
function openBookingModal() {
    document.getElementById('booking-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Open booking for specific treatment
function openBookingForTreatment(treatmentName) {
    document.getElementById('selected-treatment').value = treatmentName;
    openBookingModal();
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Submit booking to WhatsApp
function submitBooking(event) {
    event.preventDefault();
    
    const treatment = document.getElementById('selected-treatment').value;
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    
    const message = `New Booking Request
Treatment: ${treatment}
Name: ${name}
Phone: ${phone}
Date: ${date}
Time: ${time}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/94781020385?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeBookingModal();
    
    // Reset form
    document.getElementById('booking-form').reset();
}

// Search treatments
function searchTreatments() {
    const searchTerm = document.getElementById('search-input').value;
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filtered = getAllTreatments();
    
    if (searchTerm) {
        filtered = searchTreatments(searchTerm);
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    renderFilteredTreatments(filtered);
}

// Filter treatments by category
function filterTreatments() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-input').value;
    
    let filtered = getAllTreatments();
    
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    if (searchTerm) {
        filtered = searchTreatments(searchTerm);
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }
    }
    
    renderFilteredTreatments(filtered);
}

// Render filtered treatments
function renderFilteredTreatments(treatments) {
    const grid = document.getElementById('treatments-grid');
    grid.innerHTML = '';
    
    if (treatments.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.1rem;">No treatments found.</p>';
        return;
    }
    
    treatments.forEach((treatment, index) => {
        const card = document.createElement('div');
        card.className = 'treatment-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${treatment.image}" alt="${treatment.name}" class="treatment-image" loading="lazy">
            <div class="treatment-info">
                <span class="treatment-category">${capitalizeCategory(treatment.category)}</span>
                <h3 class="treatment-name">${treatment.name}</h3>
                <p class="treatment-desc">${treatment.description.substring(0, 100)}...</p>
                <button class="treatment-btn" onclick="showTreatmentDetails(${treatment.id})">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.treatment-card').forEach(card => {
            card.classList.add('animate');
        });
    }, 100);
}

// Initialize slider
let slideIndex = 0;
let slides = null;
let dots = null;

function initSlider() {
    slides = document.querySelectorAll('.slider-slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length > 0) {
        setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
}

function changeSlide(direction) {
    slideIndex += direction;
    
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    updateSlider();
}

function currentSlide(index) {
    slideIndex = index;
    updateSlider();
}

function updateSlider() {
    if (!slides || !dots) return;
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === slideIndex);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

// Initialize hamburger menu
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('hamburger-active');
        mobileMenu.classList.toggle('hidden');
    });
}

// Close modals on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
    }
});

// Close modals on outside click
window.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('booking-modal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
});