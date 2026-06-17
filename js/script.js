// DOM Content Loaded - Premium preloader with immediate hide
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen immediately on DOM ready
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        // Complete hide after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }
    
    initializeWebsite();
});

function initializeWebsite() {
    // Highlight active nav link
    highlightActiveNav();
    
    // Render treatments (only on treatments page)
    renderTreatments();

    // Initialize slider (only on homepage)
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

// Highlight active navigation link based on current page
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .p-footer-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Extract page name from href
        const hrefPage = href.split('/').pop();
        
        // Remove existing active styling
        link.classList.remove('nav-active');
        link.style.color = '';
        
        // Highlight if matches current page
        if (hrefPage === currentPage) {
            link.classList.add('nav-active');
            link.style.color = '#dc2626';
        }
    });
}

// Render treatments grid
function renderTreatments() {
    const grid = document.getElementById('treatments-grid');
    if (!grid) return;
    
    // Safety check for treatments.js function
    const treatments = typeof getAllTreatments === 'function' ? getAllTreatments() : [];
    
    grid.innerHTML = '';
    
    if (treatments.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.1rem;">No treatments available.</p>';
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
    
    // Trigger animation
    setTimeout(() => {
        document.querySelectorAll('.treatment-card').forEach(card => {
            card.classList.add('animate');
        });
    }, 100);
}

// Helper to capitalize category
function capitalizeCategory(category) {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Show treatment details in full-page view
// Two modes: 1) On treatment-details page using URL param  2) Legacy from SPA
function showTreatmentDetails(id) {
    if (typeof getTreatmentById !== 'function') return;
    
    const treatment = getTreatmentById(id);
    if (!treatment) return;
    
    // If we're NOT on treatment-details.html, redirect there
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'treatment-details.html') {
        window.location.href = `treatment-details.html?id=${id}`;
        return;
    }
    
    // We're on treatment-details.html - render the content
    const container = document.getElementById('treatment-details-content');
    if (!container) return;

    const hasVideo = treatment.videoUrl ? true : false;
    
    let mediaBoxHTML = '';
    if (hasVideo) {
        mediaBoxHTML = `
            <div class="treatment-media-slider-wrapper" style="width: 100%; margin-bottom: 15px;">
                <div id="treatment-media-slider" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; width: 100%; max-height: 400px; border-radius: 12px; background: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    
                    <div id="slide-item-1" style="flex: 0 0 100%; width: 100%; scroll-snap-align: start; position: relative;">
                        <img src="${treatment.image}" alt="${treatment.name}" style="width: 100%; height: 400px; object-fit: cover; display: block;">
                    </div>
                    
                    <div id="slide-item-2" style="flex: 0 0 100%; width: 100%; scroll-snap-align: start; position: relative; height: 400px;">
                        <iframe width="100%" height="100%" src="${treatment.videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>
                    </div>
                    
                </div>
                
                <div style="display: flex; justify-content: center; gap: 12px; margin-top: 12px;">
                    <div id="thumb-box-1" onclick="scrollToMediaSlide(1)" style="width: 60px; height: 45px; border-radius: 6px; overflow: hidden; border: 2px solid #dc2626; cursor: pointer; transition: all 0.3s ease; opacity: 1;">
                        <img src="${treatment.image}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    
                    <div id="thumb-box-2" onclick="scrollToMediaSlide(2)" style="width: 60px; height: 45px; border-radius: 6px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.3s ease; opacity: 0.6; background: #1f2937; display: flex; align-items: center; justify-content: center; position: relative;">
                        <img src="${treatment.image}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.4;">
                        <span style="position: absolute; font-size: 1.2rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);"></span>
                    </div>
                </div>
            </div>
        `;
    } else {
        mediaBoxHTML = `
            <img src="${treatment.image}" alt="${treatment.name}" class="treatment-details-image" loading="lazy" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 15px;">
        `;
    }

    container.innerHTML = `
        <div class="treatment-details-main" style="display: flex; flex-direction: column; gap: 30px; margin-bottom: 30px;">
            
            ${mediaBoxHTML} <div class="treatment-details-info">
                <span class="treatment-details-category" style="display: inline-block; background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px;">
                    ${capitalizeCategory(treatment.category)}
                </span>
                <h3 class="treatment-details-name" style="font-size: 1.4rem; font-weight: 700; margin-bottom: 15px; color: #1f2937;">${treatment.name}</h3>
                
                <div class="treatment-quick-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #f3f4f6; margin-bottom: 25px;">
                    <div>
                        <span style="display: block; font-size: 0.8rem; text-transform: uppercase; color: #9ca3af; font-weight: 600; letter-spacing: 0.5px;">🕒 Duration</span>
                        <span style="font-size: 1.2rem; font-weight: 600; color: #4b5563;">${treatment.duration || 'N/A'}</span>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.8rem; text-transform: uppercase; color: #9ca3af; font-weight: 600; letter-spacing: 0.5px;">💰 Price</span>
                        <span style="font-size: 1.2rem; font-weight: 700; color: #dc2626;">${treatment.price || 'N/A'}</span>
                    </div>
                </div>

                <p class="treatment-details-desc" style="color: #4b5563; line-height: 1.7; font-size: 1rem; margin-bottom: 25px;">${treatment.description}</p>
            </div>
        </div>

        <div class="treatment-details-extra" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
            <div>
                <h4 class="treatment-features-title" style="font-size: 1.3rem; font-weight: 700; margin-bottom: 15px; color: #1f2937;">✨ Key Features:</h4>
                <ul class="treatment-details-features" style="list-style: none; display: flex; flex-direction: column; gap: 10px; color: #4b5563; padding-left: 0;">
                    ${treatment.features ? treatment.features.map(feature => `<li style="display: flex; align-items: center; gap: 10px;">🔹 ${feature}</li>`).join('') : ''}
                </ul>
            </div>
            <div>
    <h4 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 15px; color: #1f2937;">🌟 Key Benefits:</h4>
    <ul class="treatment-details-benefits" style="list-style: none; display: flex; flex-direction: column; gap: 10px; color: #065f46; padding-left: 0;">
        ${treatment.keyBenefits ? treatment.keyBenefits.map(benefit => `<li style="display: flex; align-items: center; gap: 10px; background: #ecfdf5; padding: 10px; border-radius: 8px;">✅ ${benefit}</li>`).join('') : '<li style="color: #6b7280;">Benefits coming soon.</li>'}
    </ul>
</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #1f2937;">👤 Who is this for?</h4>
                    <p style="background: #eff6ff; color: #1e40af; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; font-size: 0.95rem; line-height: 1.6; margin: 0;">
                        ${treatment.suitability || 'Suitable for all individuals.'}
                    </p>
                </div>

                <div>
                    <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #1f2937;">⚙️ Treatment Process:</h4>
                    <p style="background: #f0fdf4; color: #166534; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; font-size: 0.95rem; line-height: 1.6; font-weight: 500; margin: 0;">
                        ${treatment.process || 'Standard Consultation & Therapy.'}
                    </p>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 30px;">
            <button class="treatment-details-book-btn" onclick="openBookingForTreatment('${treatment.name}')" style="background: #dc2626; color: white; border: none; font-size: 1.1rem; font-weight: 700; padding: 15px 40px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                Book Appointment Now
            </button>
        </div>
    `;
    
    if (hasVideo) {
        setTimeout(() => {
            const slider = document.getElementById('treatment-media-slider');
            const thumb1 = document.getElementById('thumb-box-1');
            const thumb2 = document.getElementById('thumb-box-2');
            
            if (slider && thumb1 && thumb2) {
                slider.addEventListener('scroll', function() {
                    const width = slider.clientWidth;
                    if (slider.scrollLeft >= width / 2) {
                        thumb1.style.borderColor = 'transparent';
                        thumb1.style.opacity = '0.6';
                        thumb2.style.borderColor = '#dc2626';
                        thumb2.style.opacity = '1';
                    } else {
                        thumb1.style.borderColor = '#dc2626';
                        thumb1.style.opacity = '1';
                        thumb2.style.borderColor = 'transparent';
                        thumb2.style.opacity = '0.6';
                    }
                });
            }
        }, 100);
    }
}

function scrollToMediaSlide(slideNumber) {
    const slider = document.getElementById('treatment-media-slider');
    if (!slider) return;
    
    const width = slider.clientWidth;
    if (slideNumber === 1) {
        slider.scrollLeft = 0;
    } else if (slideNumber === 2) {
        slider.scrollLeft = width;
    }
}

// Load treatment details on treatment-details page from URL param
function loadTreatmentFromUrl() {
    const id = getQueryParam('id');
    if (id) {
        showTreatmentDetails(parseInt(id));
    }
}

// Open booking modal
function openBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Open booking for specific treatment
function openBookingForTreatment(treatmentName) {
    const input = document.getElementById('selected-treatment');
    if (input) {
        input.value = treatmentName;
    }
    openBookingModal();
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Submit booking to WhatsApp with beautiful formatting
function submitBooking(event) {
    event.preventDefault();
    
    const treatment = document.getElementById('selected-treatment').value || 'General Consultation';
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    
    // Formatted message with emojis for premium look
    const message = `🌿 *New Appointment Request* 🌿\n\n` +
                    `👤 *Name:* ${name}\n` +
                    `📞 *Phone:* ${phone}\n` +
                    `💆‍♂️ *Treatment:* ${treatment}\n` +
                    `📅 *Date:* ${date}\n` +
                    `🕒 *Time:* ${time}\n\n` +
                    `Please confirm availability. Thank you!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/94704744700?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeBookingModal();
    
    // Reset form
    document.getElementById('booking-form').reset();
}

// Search and Filter treatments combined safely
function searchTreatments() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    if (typeof getAllTreatments !== 'function') return;
    let filtered = getAllTreatments();
    
    // Filter by Search Term
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(searchTerm) || 
            t.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by Category
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    renderFilteredTreatments(filtered);
}

// Filter treatments by category
function filterTreatments() {
    searchTreatments();
}

// Render filtered treatments
function renderFilteredTreatments(treatments) {
    const grid = document.getElementById('treatments-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!treatments || treatments.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.1rem; color: #6b7280;">No treatments found matching your criteria.</p>';
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
let sliderInterval = null;

function initSlider() {
    slides = document.querySelectorAll('.slider-slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length > 0) {
        // Clear any existing interval safely
        if (sliderInterval) clearInterval(sliderInterval);
        
        sliderInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
}

function changeSlide(direction) {
    if (!slides || slides.length === 0) return;
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

// Initialize hamburger menu safely
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        // Remove existing listener to prevent stacking if re-initialized
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.getElementById('hamburger');
        
        newHamburger.addEventListener('click', function() {
            newHamburger.classList.toggle('hamburger-active');
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Scroll animation implementation (Intersection Observer)
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Track standard content structures for animation
    document.querySelectorAll('.value-card, .section-title, .about-content').forEach(el => {
        observer.observe(el);
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