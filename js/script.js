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
    
    console.log("Total treatments:", treatments.length);
    
    treatments.forEach((treatment, index) => {
        const card = document.createElement('div');
        card.className = 'treatment-card';
        card.style.animationDelay = `${index * 0.1}s`;
        const btnLabel = treatment.buttonLabel || 'View Details';
        const defaultImg = typeof DEFAULT_TREATMENT_IMAGE !== 'undefined' ? DEFAULT_TREATMENT_IMAGE : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80';
        const imgSrc = treatment.image && treatment.image !== '' ? treatment.image : defaultImg;
        card.innerHTML = `
            <img src="${imgSrc}" alt="${treatment.name}" class="treatment-image" loading="lazy" onerror="this.src='${defaultImg}'">
            <div class="treatment-info">
                <span class="treatment-category">${capitalizeCategory(treatment.category)}</span>
                <h3 class="treatment-name">${treatment.name}</h3>
                <p class="treatment-desc">${treatment.description.substring(0, 100)}...</p>
                <button class="treatment-btn" onclick="showTreatmentDetails(${treatment.id})">${btnLabel}</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    console.log("Rendered cards:", document.querySelectorAll('.treatment-card').length);
    
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

    // Build media slider items from images and videos arrays
    const mediaItems = buildMediaItems(treatment);
    const mediaBoxHTML = buildMediaSliderHTML(mediaItems, treatment);

    container.innerHTML = `
        <div class="treatment-details-main" style="display: flex; flex-direction: column; gap: 30px; margin-bottom: 30px;">
            
                    ${mediaBoxHTML}
                    
                    <div class="treatment-details-info">
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
            ${treatment.includedTreatments ? `
            <div style="grid-column: 1 / -1;">
                <h4 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 15px; color: #1f2937;">📋 Included Treatments:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    ${treatment.includedTreatments.map(item => `
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 15px;">
                            <h5 style="font-size: 1rem; font-weight: 700; color: #dc2626; margin: 0 0 8px 0;">🟠 ${item.name}</h5>
                            <p style="font-size: 0.9rem; color: #4b5563; line-height: 1.5; margin: 0;">${item.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
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
    
    // Initialize the media slider after render
    if (mediaItems.length > 0) {
        setTimeout(() => initTreatmentMediaSlider(treatment.id), 150);
    }
}

/**
 * Build a flat array of media items from treatment images/videos config
 */
function buildMediaItems(treatment) {
    const items = [];
    const images = (treatment.images && treatment.images.length > 0) ? treatment.images : [treatment.image || DEFAULT_TREATMENT_IMAGE];
    const videos = (treatment.videos && treatment.videos.length > 0) ? treatment.videos : (treatment.videoUrl ? [treatment.videoUrl] : []);
    
    // Alternate images and videos: Slide 1=image, Slide 2=image, Slide 3=video, Slide 4=image, Slide 5=video
    let imgIdx = 0, vidIdx = 0;
    const totalSlides = Math.max(images.length, videos.length * 2);
    
    for (let i = 0; i < totalSlides; i++) {
        // Interleave: place images in even positions, videos in odd positions that follow
        if (i % 2 === 0 && imgIdx < images.length) {
            items.push({ type: 'image', src: images[imgIdx++] });
        } else if (vidIdx < videos.length) {
            items.push({ type: 'video', src: videos[vidIdx++] });
        } else if (imgIdx < images.length) {
            items.push({ type: 'image', src: images[imgIdx++] });
        }
    }
    
    // Ensure at least one item
    if (items.length === 0) {
        items.push({ type: 'image', src: DEFAULT_TREATMENT_IMAGE });
    }
    
    return items;
}

/**
 * Build the HTML for the media slider
 */
function buildMediaSliderHTML(mediaItems, treatment) {
    const hasMultiple = mediaItems.length > 1;
    
    // Build slides
    let slidesHTML = '';
    let thumbsHTML = '';
    
    mediaItems.forEach((item, index) => {
        const isActive = index === 0;
        
        if (item.type === 'image') {
            slidesHTML += `
                <div class="ms-slide ${isActive ? 'ms-active' : ''}" data-index="${index}" data-type="image">
                    <img src="${item.src}" alt="${treatment.name}" class="ms-slide-img" loading="${isActive ? 'eager' : 'lazy'}">
                </div>
            `;
        } else {
            slidesHTML += `
                <div class="ms-slide ${isActive ? 'ms-active' : ''}" data-index="${index}" data-type="video" data-video="${item.src}">
                    <div class="ms-video-placeholder">
                        <img src="https://img.youtube.com/vi/${extractYouTubeId(item.src)}/maxresdefault.jpg" alt="Video thumbnail" class="ms-slide-img" loading="lazy" onerror="this.src='${treatment.image || DEFAULT_TREATMENT_IMAGE}'">
                        <div class="ms-play-icon">▶</div>
                    </div>
                </div>
            `;
        }
        
        // Thumbnail
        const thumbSrc = item.type === 'video'
            ? `https://img.youtube.com/vi/${extractYouTubeId(item.src)}/default.jpg`
            : item.src;
        const isVideo = item.type === 'video';
        
        thumbsHTML += `
            <div class="ms-thumb ${isActive ? 'ms-thumb-active' : ''}" data-index="${index}" onclick="goToMediaSlide(${index})">
                <img src="${thumbSrc}" alt="Slide ${index + 1}" loading="lazy" onerror="this.src='${DEFAULT_TREATMENT_IMAGE}'">
                ${isVideo ? '<span class="ms-thumb-play">▶</span>' : ''}
            </div>
        `;
    });
    
    const arrowsHTML = hasMultiple ? `
        <button class="ms-arrow ms-arrow-left" onclick="goToMediaSlide(window.msCurrentSlide - 1)" aria-label="Previous slide">‹</button>
        <button class="ms-arrow ms-arrow-right" onclick="goToMediaSlide(window.msCurrentSlide + 1)" aria-label="Next slide">›</button>
    ` : '';
    
    const dotsHTML = hasMultiple ? `
        <div class="ms-dots">
            ${mediaItems.map((_, i) => `<span class="ms-dot ${i === 0 ? 'ms-dot-active' : ''}" onclick="goToMediaSlide(${i})"></span>`).join('')}
        </div>
    ` : '';
    
    const fullscreenBtn = `<button class="ms-fullscreen-btn" onclick="toggleMediaFullscreen()" aria-label="Fullscreen">⛶</button>`;
    
    return `
        <div class="treatment-media-slider-container" id="treatment-media-slider-${treatment.id}" data-total="${mediaItems.length}">
            <div class="ms-main-wrapper">
                <div class="ms-track" id="ms-track-${treatment.id}">
                    ${slidesHTML}
                </div>
                ${arrowsHTML}
                ${fullscreenBtn}
                ${dotsHTML}
            </div>
            ${hasMultiple ? `
            <div class="ms-thumbnails" id="ms-thumbnails-${treatment.id}">
                ${thumbsHTML}
            </div>
            ` : ''}
        </div>
    `;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url) {
    if (!url) return '';
    const patterns = [
        /(?:youtube\.com\/embed\/)([^?&]+)/,
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtu\.be\/)([^?&]+)/
    ];
    for (const p of patterns) {
        const match = url.match(p);
        if (match) return match[1];
    }
    return '';
}

/**
 * Initialize the media slider — manual only (arrows, dots, keyboard, swipe). No auto-sliding.
 */
function initTreatmentMediaSlider(treatmentId) {
    const container = document.getElementById(`treatment-media-slider-${treatmentId}`);
    if (!container) return;
    
    const track = container.querySelector('.ms-track');
    const slides = container.querySelectorAll('.ms-slide');
    const dots = container.querySelectorAll('.ms-dot');
    const thumbs = container.querySelectorAll('.ms-thumb');
    const total = slides.length;
    
    if (total === 0) return;
    
    let current = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let isTransitioning = false;
    
    window.msCurrentSlide = 0;
    
    // Update active slide (manual only)
    function goTo(index) {
        if (isTransitioning) return;
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        if (index === current) return;
        
        isTransitioning = true;
        current = index;
        window.msCurrentSlide = current;
        
        // Update slides
        slides.forEach((s, i) => {
            s.classList.toggle('ms-active', i === current);
        });
        
        // Update dots
        dots.forEach((d, i) => {
            d.classList.toggle('ms-dot-active', i === current);
        });
        
        // Update thumbs
        thumbs.forEach((t, i) => {
            t.classList.toggle('ms-thumb-active', i === current);
        });
        
        // Handle video slide
        handleVideoSlide(current);
        
        setTimeout(() => { isTransitioning = false; }, 400);
    }
    
    // Handle video slide — load iframe when slide becomes active
    function handleVideoSlide(index) {
        const slide = slides[index];
        if (!slide) return;
        
        const type = slide.dataset.type;
        const videoSrc = slide.dataset.video;
        
        if (type === 'video' && videoSrc) {
            // Check if iframe already loaded
            if (!slide.querySelector('iframe')) {
                const placeholder = slide.querySelector('.ms-video-placeholder');
                if (placeholder) {
                    const iframe = document.createElement('iframe');
                    iframe.src = videoSrc + (videoSrc.includes('?') ? '&' : '?') + 'autoplay=1&enablejsapi=1';
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.className = 'ms-video-iframe';
                    placeholder.innerHTML = '';
                    placeholder.appendChild(iframe);
                }
            }
        } else {
            // Remove any existing iframe in non-video slides to free resources
            slides.forEach(s => {
                if (s.dataset.type !== 'video') {
                    const oldIframe = s.querySelector('iframe');
                    if (oldIframe) {
                        oldIframe.src = '';
                        oldIframe.remove();
                    }
                }
            });
        }
    }
    
    // Expose goTo globally for onclick handlers
    window.goToMediaSlide = function(index) {
        goTo(index);
    };
    
    // Keyboard navigation (desktop)
    document.addEventListener('keydown', function msKeyHandler(e) {
        if (!document.contains(container)) {
            document.removeEventListener('keydown', msKeyHandler);
            return;
        }
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });
    
    // Touch swipe support (mobile)
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(current + 1);
            else goTo(current - 1);
        }
    }, { passive: true });
    
    // Mouse drag support (desktop)
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        track.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragOffset = e.clientX - dragStartX;
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        if (Math.abs(dragOffset) > 50) {
            if (dragOffset < 0) goTo(current + 1);
            else goTo(current - 1);
        }
        dragOffset = 0;
    });
    
    // Handle first slide if it's a video
    handleVideoSlide(0);
}

/**
 * Toggle fullscreen mode for the media slider
 */
function toggleMediaFullscreen() {
    const container = document.querySelector('.treatment-media-slider-container');
    if (!container) return;
    
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
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
    
    console.log("Filtered treatments count:", treatments ? treatments.length : 0);
    
    treatments.forEach((treatment, index) => {
        const card = document.createElement('div');
        card.className = 'treatment-card';
        card.style.animationDelay = `${index * 0.1}s`;
        const btnLabel = treatment.buttonLabel || 'View Details';
        const defaultImg = typeof DEFAULT_TREATMENT_IMAGE !== 'undefined' ? DEFAULT_TREATMENT_IMAGE : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80';
        const imgSrc = treatment.image && treatment.image !== '' ? treatment.image : defaultImg;
        card.innerHTML = `
            <img src="${imgSrc}" alt="${treatment.name}" class="treatment-image" loading="lazy" onerror="this.src='${defaultImg}'">
            <div class="treatment-info">
                <span class="treatment-category">${capitalizeCategory(treatment.category)}</span>
                <h3 class="treatment-name">${treatment.name}</h3>
                <p class="treatment-desc">${treatment.description.substring(0, 100)}...</p>
                <button class="treatment-btn" onclick="showTreatmentDetails(${treatment.id})">${btnLabel}</button>
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
    document.querySelectorAll('.value-card, .section-title, .about-content, .reviews-section, .scroll-animate').forEach(el => {
        observer.observe(el);
    });
    
    // Special handling for .scroll-animate elements: add .animate-in when visible
    const scrollAnimateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                scrollAnimateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollAnimateObserver.observe(el);
    });

    // Signature treatment card entrance animation
    const signatureCard = document.getElementById('signature-card');
    if (signatureCard) {
        const sigObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    sigObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        sigObserver.observe(signatureCard);
    }
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