// ═══════════════════════════════════════
//  THE ONYX PROJECT — INTERACTIVE FUNCTIONALITY
// ═══════════════════════════════════════

const STOCK_API_KEY = '041M45P0WTZN93PY';

function debounce(func, wait) {
    let timeout;
    return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
}

// ═══ PAGE LOADER ═══
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.style.display = 'none', 500);
        // Launch the hero cinematic entrance
        if (typeof heroEntrance !== 'undefined') heroEntrance.start();
    }, 800);
});

// ═══ CURSOR AMBIENT GLOW ═══
const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
if (hasFineCursor) {
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = -200, mouseY = -200, glowX = -200, glowY = -200;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth trailing glow — slower easing for ambient feel
    (function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        cursorGlow.style.transform = 'translate(-50%, -50%)';
        requestAnimationFrame(animateGlow);
    })();

    // Brighten glow on interactive elements
    document.querySelectorAll('a, button, input, select, textarea, .lab-card, .nav-dot, .carousel-dot, .resource-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hovering'));
    });
}

// ═══ SCROLL PROGRESS ═══
const scrollProgressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', debounce(() => {
    const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    scrollProgressBar.style.width = scrolled + '%';
}, 10));

// ═══ SECTION NAV DOTS ═══
const allSections = document.querySelectorAll('.hero, .about, .carousel-section, .tableau-section, .live-lab, .cta-section');
const navDots = document.querySelectorAll('.nav-dot');
const mobNavItems = document.querySelectorAll('.mob-nav-item');
const navLinksAll = document.querySelectorAll('.nav-links a[data-section]');

function updateActiveSection() {
    let current = '';
    allSections.forEach(s => {
        if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navDots.forEach(d => { d.classList.toggle('active', d.getAttribute('data-target') === current); d.setAttribute('aria-current', d.getAttribute('data-target') === current ? 'page' : 'false'); });
    // Mobile bottom nav — direct mapping for 5-tab layout
    const mobMap = { home: 'home', about: 'home', work: 'work', dashboard: 'dashboard', lab: 'lab', connect: 'connect' };
    const mobTarget = mobMap[current] || 'home';
    mobNavItems.forEach(m => { m.classList.toggle('active', m.getAttribute('data-target') === mobTarget); m.setAttribute('aria-current', m.getAttribute('data-target') === mobTarget ? 'page' : 'false'); });
    // Top nav links — active section indicator
    navLinksAll.forEach(a => { a.classList.toggle('nav-active', a.getAttribute('data-section') === current); a.setAttribute('aria-current', a.getAttribute('data-section') === current ? 'page' : 'false'); });
}
window.addEventListener('scroll', debounce(updateActiveSection, 50));

// ═══ BACK TO TOP ═══
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', debounce(() => {
    backToTop.classList.toggle('visible', window.pageYOffset > 500);
}, 50));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ═══ PARALLAX ═══
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('[data-parallax]').forEach(el => {
        el.style.transform = `translateY(${scrolled * (parseFloat(el.dataset.parallax) || 0.5)}px)`;
    });
}, 10));

// ═══ MAGNETIC BUTTONS ═══ (removed — keeps buttons anchored for premium feel)

// ═══ SUCCESS FLASH ═══
function showSuccess(el) { el.classList.add('success-flash'); setTimeout(() => el.classList.remove('success-flash'), 1000); }

// ═══ SKELETON LOADER ═══
function showSkeleton(el) {
    el.innerHTML = '<div class="skeleton"><div class="skeleton-line" style="width:100%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:60%"></div></div>';
}

// ═══ LOGO SCROLL TO TOP ═══
const navLogo = document.getElementById('navLogo');
if (navLogo) navLogo.addEventListener('click', e => {
    e.preventDefault();
    // Close mobile menu if open
    if (navLinks.classList.contains('mobile-open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        nav.classList.remove('nav-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        const mobileBottomNav = document.getElementById('mobileBottomNav');
        if (mobileBottomNav) mobileBottomNav.style.display = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══ NAVIGATION ═══
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80));

navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    nav.classList.toggle('nav-open', isOpen);
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', isOpen);
    // Hide/show mobile bottom nav when hamburger menu toggles
    const mobileBottomNav = document.getElementById('mobileBottomNav');
    if (mobileBottomNav) mobileBottomNav.style.display = isOpen ? 'none' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        nav.classList.remove('nav-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        // Restore mobile bottom nav
        const mobileBottomNav = document.getElementById('mobileBottomNav');
        if (mobileBottomNav) mobileBottomNav.style.display = '';
    });
});

// Close mobile menu on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        nav.classList.remove('nav-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        const mobileBottomNav = document.getElementById('mobileBottomNav');
        if (mobileBottomNav) mobileBottomNav.style.display = '';
    }
});

// ═══ SCROLL REVEAL ═══
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = nav.offsetHeight + 20;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
    });
});

// ═══════════════════════════════════════
//  FEATURED WORK CAROUSEL
// ═══════════════════════════════════════
const carousel = {
    track: document.getElementById('carouselTrack'),
    dotsContainer: document.getElementById('carouselDots'),
    progressBar: document.getElementById('carouselProgressBar'),
    prevBtn: document.getElementById('carouselPrev'),
    nextBtn: document.getElementById('carouselNext'),
    current: 0,
    total: 0,
    autoTimer: null,
    autoDelay: 15000,
    touchStartX: 0,
    touchEndX: 0,
    isPaused: false,

    init() {
        if (!this.track) return;
        this.slides = this.track.querySelectorAll('.carousel-slide');
        this.total = this.slides.length;
        if (this.total === 0) return;

        // Create dots
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => { this.goTo(i); this.restartAuto(); });
            this.dotsContainer.appendChild(dot);
        }

        this.prevBtn.addEventListener('click', () => { this.prev(); this.restartAuto(); });
        this.nextBtn.addEventListener('click', () => { this.next(); this.restartAuto(); });

        // Pause on hover (desktop)
        const wrapper = this.track.closest('.carousel-wrapper') || this.track.parentElement;
        wrapper.addEventListener('mouseenter', () => { this.isPaused = true; this.stopAuto(); });
        wrapper.addEventListener('mouseleave', () => { this.isPaused = false; this.startAuto(); });

        // Touch / swipe
        this.track.addEventListener('touchstart', e => { this.touchStartX = e.changedTouches[0].screenX; this.stopAuto(); }, { passive: true });
        this.track.addEventListener('touchend', e => {
            this.touchEndX = e.changedTouches[0].screenX;
            const diff = this.touchStartX - this.touchEndX;
            if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); }
            this.startAuto();
        }, { passive: true });

        // Internal links should stop carousel auto-advance
        this.track.querySelectorAll('.carousel-internal-link').forEach(link => {
            link.addEventListener('click', () => this.stopAuto());
        });

        // Pause when user interacts with carousel videos
        // Only pause carousel if user manually pauses the video (not autoplay)
        let videoListenersActive = false;
        setTimeout(() => { videoListenersActive = true; }, 3000);
        this.track.querySelectorAll('video').forEach(video => {
            video.addEventListener('pause', () => {
                // Only pause carousel if video is in active slide and wasn't paused by carousel update
                if (videoListenersActive && video.closest('.carousel-slide')?.classList.contains('active-slide')) {
                    this.isPaused = false; // Reset carousel pause state when video is paused manually
                }
            });
        });

        // Keyboard
        document.addEventListener('keydown', e => {
            const carouselRect = document.getElementById('work')?.getBoundingClientRect();
            if (!carouselRect || carouselRect.top > window.innerHeight || carouselRect.bottom < 0) return;
            if (e.key === 'ArrowLeft') { this.prev(); this.restartAuto(); }
            if (e.key === 'ArrowRight') { this.next(); this.restartAuto(); }
        });

        this.update();
        this.startAuto();
        
        // Ensure first video plays immediately after a brief delay for browser readiness
        setTimeout(() => {
            const firstVideo = this.slides[0]?.querySelector('video');
            if (firstVideo) {
                firstVideo.play().catch(() => {
                    // If autoplay fails, at least the video is loaded and visible
                });
            }
        }, 100);
    },

    goTo(index) {
        this.current = ((index % this.total) + this.total) % this.total;
        this.update();
    },

    next() { this.goTo(this.current + 1); },
    prev() { this.goTo(this.current - 1); },

    update() {
        this.track.style.transform = `translateX(-${this.current * 100}%)`;
        // Dots
        this.dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === this.current));
        // Progress
        this.progressBar.style.width = `${((this.current + 1) / this.total) * 100}%`;
        // Accessibility: mark active/hidden slides
        this.slides.forEach((slide, i) => {
            const isActive = i === this.current;
            slide.setAttribute('aria-hidden', !isActive);
            slide.classList.toggle('active-slide', isActive);
            slide.querySelectorAll('a, button, input, select, textarea, video').forEach(el => {
                el.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            // Play videos on active slide, pause on inactive slides
            slide.querySelectorAll('video').forEach(video => {
                if (isActive) {
                    video.play().catch(() => {}); // Resume playing
                } else {
                    video.pause(); // Pause videos on hidden slides
                }
            });
        });
    },

    startAuto() {
        if (this.isPaused) return;
        this.stopAuto();
        this.autoTimer = setInterval(() => this.next(), this.autoDelay);
    },

    stopAuto() {
        if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; }
    },

    restartAuto() {
        this.isPaused = false;
        this.stopAuto();
        this.autoTimer = setInterval(() => this.next(), this.autoDelay);
    }
};
carousel.init();

// Pause carousel when off-screen
(() => {
    const workSection = document.getElementById('work');
    if (!workSection) return;
    const carouselObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!carousel.isPaused) carousel.startAuto();
            } else {
                carousel.stopAuto();
            }
        });
    }, { threshold: 0.05 });
    carouselObs.observe(workSection);
})();

// ═══ MEDIA FALLBACK HANDLING ═══
// Slide media: if image fails, show a styled empty container
document.querySelectorAll('img.slide-media').forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        img.closest('.slide-visual').classList.add('slide-visual-dark');
        // Insert a minimal fallback
        const fallback = document.createElement('div');
        fallback.className = 'slide-placeholder-viz';
        fallback.innerHTML = '<i class="fas fa-image"></i><span>Image coming soon</span>';
        img.closest('.slide-visual').appendChild(fallback);
    });
});
// Resource thumbs: if image fails, show the icon fallback
document.querySelectorAll('img.resource-thumb').forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        const fallback = img.nextElementSibling;
        if (fallback && fallback.classList.contains('resource-preview-fallback')) {
            fallback.style.display = 'block';
        }
    });
});

// ═══════════════════════════════════════
//  LAB TABS — with sliding indicator + keyboard navigation
// ═══════════════════════════════════════
const labTabIndicator = document.getElementById('labTabIndicator');
const labTabs = document.querySelectorAll('.lab-tab');

function selectTab(tab) {
    const index = Array.from(labTabs).indexOf(tab);
    const target = tab.dataset.tab;
    // Update tabs
    document.querySelectorAll('.lab-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    // Slide the indicator
    if (labTabIndicator) labTabIndicator.setAttribute('data-pos', index);
    // Update panels
    document.querySelectorAll('.lab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.querySelector(`.lab-panel[data-panel="${target}"]`);
    if (panel) panel.classList.add('active');
    tab.focus();
}

document.querySelectorAll('.lab-tab').forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    
    tab.addEventListener('keydown', (e) => {
        let nextTab = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextTab = labTabs[(index + 1) % labTabs.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            nextTab = labTabs[(index - 1 + labTabs.length) % labTabs.length];
        } else if (e.key === 'Home') {
            e.preventDefault();
            nextTab = labTabs[0];
        } else if (e.key === 'End') {
            e.preventDefault();
            nextTab = labTabs[labTabs.length - 1];
        }
        if (nextTab) selectTab(nextTab);
    });
});

// ═══════════════════════════════════════
//  FETCH WITH TIMEOUT HELPER
// ═══════════════════════════════════════
async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error('Request timeout — please try again');
        throw error;
    }
}

// ═══════════════════════════════════════
//  WEATHER TOOL
// ═══════════════════════════════════════
const weatherBtn = document.getElementById('weatherBtn');
const weatherCity = document.getElementById('weatherCity');
const weatherResult = document.getElementById('weatherResult');

weatherBtn.addEventListener('click', async () => {
    const city = weatherCity.value.trim();
    if (!city) { weatherResult.innerHTML = '<div style="color:#f44336;">Please enter a city name</div>'; return; }
    
    showSkeleton(weatherResult);
    
    try {
        // Geocode
        const geoRes = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results?.length) throw new Error('City not found');
        const { latitude, longitude, name: cityName, country } = geoData.results[0];
        
        // Weather
        const wxRes = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`);
        const wxData = await wxRes.json();
        const c = wxData.current;
        
        const conditions = { 0:'Clear ☀️', 1:'Mostly Clear 🌤️', 2:'Partly Cloudy ⛅', 3:'Overcast ☁️', 45:'Foggy 🌫️', 48:'Fog 🌫️', 51:'Light Drizzle 🌦️', 53:'Drizzle 🌧️', 55:'Heavy Drizzle 🌧️', 61:'Light Rain 🌦️', 63:'Rain 🌧️', 65:'Heavy Rain 🌧️', 71:'Light Snow ❄️', 73:'Snow 🌨️', 75:'Heavy Snow 🌨️', 80:'Rain Showers 🌦️', 81:'Moderate Showers 🌧️', 82:'Heavy Showers ⛈️', 95:'Thunderstorm ⛈️', 96:'Hail Storm ⛈️' };
        
        weatherResult.innerHTML = `
            <div class="weather-data">
                <div class="weather-item"><div class="weather-label">Location</div><div class="weather-value">${cityName}, ${country}</div></div>
                <div class="weather-item"><div class="weather-label">Condition</div><div class="weather-value">${conditions[c.weather_code] || 'Unknown'}</div></div>
                <div class="weather-item"><div class="weather-label">Temperature</div><div class="weather-value">${Math.round(c.temperature_2m)}°F</div></div>
                <div class="weather-item"><div class="weather-label">Humidity</div><div class="weather-value">${c.relative_humidity_2m}%</div></div>
                <div class="weather-item"><div class="weather-label">Wind</div><div class="weather-value">${Math.round(c.wind_speed_10m)} mph</div></div>
            </div>`;
        showSuccess(weatherResult);
    } catch (err) {
        weatherResult.innerHTML = `<div style="color:#f44336;">${err.message}</div>`;
    }
});
weatherCity.addEventListener('keypress', e => { if (e.key === 'Enter') weatherBtn.click(); });

// ═══════════════════════════════════════
//  DATA CALCULATOR
// ═══════════════════════════════════════
document.getElementById('calculateBtn').addEventListener('click', () => {
    const input = document.getElementById('dataInput').value.trim();
    const result = document.getElementById('calcResult');
    if (!input) { result.innerHTML = '<div style="color:#f44336;">Please enter some numbers</div>'; return; }
    
    const nums = input.split(/[,\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (!nums.length) { result.innerHTML = '<div style="color:#f44336;">No valid numbers found</div>'; return; }
    
    const sum = nums.reduce((a,b) => a+b, 0);
    const mean = sum / nums.length;
    const sorted = [...nums].sort((a,b) => a-b);
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2-1] + sorted[sorted.length/2]) / 2 : sorted[Math.floor(sorted.length/2)];
    
    result.innerHTML = `<div class="calc-grid">
        <div class="calc-item"><span class="calc-label">Count</span><span class="calc-value">${nums.length}</span></div>
        <div class="calc-item"><span class="calc-label">Sum</span><span class="calc-value">${sum.toFixed(2)}</span></div>
        <div class="calc-item"><span class="calc-label">Mean</span><span class="calc-value">${mean.toFixed(2)}</span></div>
        <div class="calc-item"><span class="calc-label">Median</span><span class="calc-value">${median.toFixed(2)}</span></div>
        <div class="calc-item"><span class="calc-label">Min</span><span class="calc-value">${Math.min(...nums).toFixed(2)}</span></div>
        <div class="calc-item"><span class="calc-label">Max</span><span class="calc-value">${Math.max(...nums).toFixed(2)}</span></div>
    </div>`;
    showSuccess(result);
});

// ═══════════════════════════════════════
//  STOCK LOOKUP
// ═══════════════════════════════════════
const stockBtn = document.getElementById('stockBtn'), stockSymbol = document.getElementById('stockSymbol'), stockResult = document.getElementById('stockResult');

const companyNames = { AAPL:'Apple Inc.', MSFT:'Microsoft', GOOGL:'Alphabet', AMZN:'Amazon', TSLA:'Tesla', META:'Meta Platforms', NVDA:'NVIDIA', JPM:'JPMorgan Chase', V:'Visa', WMT:'Walmart', PFE:'Pfizer', DIS:'Disney', NFLX:'Netflix', BA:'Boeing', NKE:'Nike' };

stockBtn.addEventListener('click', async () => {
    const sym = stockSymbol.value.trim().toUpperCase();
    if (!sym) { stockResult.innerHTML = '<div style="color:#f44336;">Please enter a stock symbol</div>'; return; }
    
    showSkeleton(stockResult);
    
    try {
        const res = await fetchWithTimeout(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${STOCK_API_KEY}`, 10000);
        const data = await res.json();
        if (data['Error Message']) throw new Error('Invalid symbol');
        if (data['Note'] || data['Information']) throw new Error('API rate limit (25/day). Try again later.');
        const q = data['Global Quote'];
        if (!q || !Object.keys(q).length) throw new Error('No data for this symbol');
        
        const price = parseFloat(q['05. price']), change = parseFloat(q['09. change']), pct = parseFloat(q['10. change percent']);
        const pos = change >= 0;
        
        stockResult.innerHTML = `<div class="stock-data">
            <div class="stock-header"><span class="stock-symbol">${q['01. symbol']}</span><span class="stock-name">${companyNames[sym] || sym}</span></div>
            <div><div class="stock-price">$${price.toFixed(2)}</div>
            <div class="stock-change ${pos?'positive':'negative'}">${pos?'▲':'▼'} ${Math.abs(change).toFixed(2)} (${Math.abs(pct).toFixed(2)}%)</div></div>
            <div class="stock-metrics">
                <div class="stock-metric"><span class="stock-metric-label">Open</span><span class="stock-metric-value">$${parseFloat(q['02. open']).toFixed(2)}</span></div>
                <div class="stock-metric"><span class="stock-metric-label">Prev Close</span><span class="stock-metric-value">$${parseFloat(q['08. previous close']).toFixed(2)}</span></div>
                <div class="stock-metric"><span class="stock-metric-label">High</span><span class="stock-metric-value">$${parseFloat(q['03. high']).toFixed(2)}</span></div>
                <div class="stock-metric"><span class="stock-metric-label">Low</span><span class="stock-metric-value">$${parseFloat(q['04. low']).toFixed(2)}</span></div>
                <div class="stock-metric" style="grid-column:1/-1"><span class="stock-metric-label">Volume</span><span class="stock-metric-value">${parseInt(q['06. volume']).toLocaleString()}</span></div>
            </div>
            <div class="stock-timestamp">${new Date(q['07. latest trading day']).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
        </div>`;
        showSuccess(stockResult);
    } catch (err) { stockResult.innerHTML = `<div style="color:#f44336;">${err.message}</div>`; }
});
stockSymbol.addEventListener('keypress', e => { if (e.key === 'Enter') stockBtn.click(); });

// ═══════════════════════════════════════
//  TEXT ANALYTICS
// ═══════════════════════════════════════
const textInput = document.getElementById('textInput'), textResult = document.getElementById('textResult');
textInput.addEventListener('input', () => {
    const text = textInput.value;
    if (!text.trim()) { textResult.innerHTML = ''; return; }
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length, noSpace = text.replace(/\s/g,'').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    textResult.innerHTML = `
        <div class="text-stat"><div class="text-stat-value">${words.length}</div><div class="text-stat-label">Words</div></div>
        <div class="text-stat"><div class="text-stat-value">${chars}</div><div class="text-stat-label">Characters</div></div>
        <div class="text-stat"><div class="text-stat-value">${noSpace}</div><div class="text-stat-label">No Spaces</div></div>
        <div class="text-stat"><div class="text-stat-value">${sentences}</div><div class="text-stat-label">Sentences</div></div>
        <div class="text-stat"><div class="text-stat-value">${paragraphs}</div><div class="text-stat-label">Paragraphs</div></div>
        <div class="text-stat"><div class="text-stat-value">${Math.ceil(words.length/200)}</div><div class="text-stat-label">Min Read</div></div>`;
});

// ═══════════════════════════════════════
//  TABLEAU RESPONSIVE
// ═══════════════════════════════════════
function resizeTableau() {
    const viz = document.getElementById('tableauViz');
    if (!viz) return;
    const w = window.innerWidth;
    viz.setAttribute('height', w <= 480 ? 450 : w <= 768 ? 600 : w <= 1024 ? 900 : 1100);
}
resizeTableau();
window.addEventListener('resize', resizeTableau);

// ═══ VIEWPORT HEIGHT FIX ═══
function setVH() { document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); }
setVH();
window.addEventListener('resize', setVH);

// ═══════════════════════════════════════
//  ABOUT — MESH GRADIENT CANVAS
// ═══════════════════════════════════════
(() => {
    const canvas = document.getElementById('aboutMesh');
    const section = document.getElementById('about');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let w = 0, h = 0, animId = null, isActive = false;
    let mouseX = 0.5, mouseY = 0.5; // normalized 0-1

    // 4 light sources that drift organically
    const lights = [
        { x: 0.25, y: 0.3, r: 280, vx: 0.0003, vy: 0.0002, phase: 0, speed: 0.003, alpha: 0.07 },
        { x: 0.7, y: 0.25, r: 320, vx: -0.0002, vy: 0.0003, phase: 1.5, speed: 0.002, alpha: 0.05 },
        { x: 0.5, y: 0.7, r: 250, vx: 0.0001, vy: -0.0002, phase: 3, speed: 0.004, alpha: 0.06 },
        { x: 0.15, y: 0.65, r: 200, vx: 0.0002, vy: 0.0001, phase: 4.5, speed: 0.0025, alpha: 0.04 }
    ];
    const gold = { r: 200, g: 164, b: 90 };

    function resize() {
        w = canvas.width = section.offsetWidth;
        h = canvas.height = section.offsetHeight;
    }

    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
    });

    function render() {
        ctx.clearRect(0, 0, w, h);

        for (const l of lights) {
            l.phase += l.speed;

            // Organic drift
            l.x += l.vx + Math.sin(l.phase) * 0.0004;
            l.y += l.vy + Math.cos(l.phase * 0.7) * 0.0003;

            // Mouse influence (gentle)
            l.x += (mouseX - l.x) * 0.001;
            l.y += (mouseY - l.y) * 0.001;

            // Soft bounds
            if (l.x < 0.05 || l.x > 0.95) l.vx *= -1;
            if (l.y < 0.05 || l.y > 0.95) l.vy *= -1;
            l.x = Math.max(0, Math.min(1, l.x));
            l.y = Math.max(0, Math.min(1, l.y));

            // Breathing alpha
            const breathe = l.alpha * (0.7 + 0.3 * Math.sin(l.phase * 1.5));
            const px = l.x * w;
            const py = l.y * h;
            const r = l.r + Math.sin(l.phase * 0.8) * 40;

            const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
            grad.addColorStop(0, `rgba(${gold.r},${gold.g},${gold.b},${breathe})`);
            grad.addColorStop(0.4, `rgba(${gold.r},${gold.g},${gold.b},${breathe * 0.4})`);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        if (isActive) animId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isActive) { isActive = true; section.classList.add('mesh-active'); render(); }
            } else {
                isActive = false; section.classList.remove('mesh-active');
                if (animId) cancelAnimationFrame(animId);
            }
        });
    }, { threshold: 0.05 });
    observer.observe(section);

    resize();
    window.addEventListener('resize', debounce(resize, 200));
})();

// ═══════════════════════════════════════
//  ABOUT — TIMELINE ENERGY PULSE
// ═══════════════════════════════════════
(() => {
    const timeline = document.getElementById('aboutTimeline');
    const energy = document.getElementById('timelineEnergy');
    if (!timeline || !energy) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    energy.classList.add('active');
                    const line = timeline.querySelector('.timeline-line');
                    if (line) setTimeout(() => line.classList.add('energized'), 800);
                    timeline.querySelectorAll('.timeline-node').forEach((node, i) => {
                        setTimeout(() => node.classList.add('node-activated'), 300 + i * 350);
                    });
                }, 400);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    obs.observe(timeline);
})();

// ═══════════════════════════════════════
//  ABOUT — EXPLORING TICKER (typewriter)
// ═══════════════════════════════════════
(() => {
    const ticker = document.getElementById('exploringTicker');
    if (!ticker) return;
    const items = ticker.querySelectorAll('.ticker-item');
    if (!items.length) return;

    let currentIndex = 0;
    const HOLD = 2500, TYPE_SPEED = 55, ERASE_SPEED = 30;
    let activeIntervals = [];

    function clearIntervals() {
        activeIntervals.forEach(id => clearInterval(id));
        activeIntervals = [];
    }

    function typeText(item, text, cb) {
        let i = 0; item.textContent = ''; item.classList.add('active');
        const iv = setInterval(() => { item.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(iv); activeIntervals = activeIntervals.filter(id => id !== iv); setTimeout(cb, HOLD); } }, TYPE_SPEED);
        activeIntervals.push(iv);
    }
    function eraseText(item, cb) {
        let text = item.textContent, i = text.length;
        const iv = setInterval(() => { item.textContent = text.slice(0, --i); if (i <= 0) { clearInterval(iv); activeIntervals = activeIntervals.filter(id => id !== iv); item.classList.remove('active'); cb(); } }, ERASE_SPEED);
        activeIntervals.push(iv);
    }
    function cycle() {
        const item = items[currentIndex];
        const fullText = item.getAttribute('data-text') || item.textContent.trim();
        if (!item.getAttribute('data-text')) item.setAttribute('data-text', fullText);
        typeText(item, fullText, () => eraseText(item, () => { currentIndex = (currentIndex + 1) % items.length; cycle(); }));
    }

    items.forEach(item => { item.setAttribute('data-text', item.textContent.trim()); item.textContent = ''; item.classList.remove('active'); });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                setTimeout(cycle, 800); 
                obs.unobserve(entry.target); 
            } else {
                clearIntervals();
            }
        });
    }, { threshold: 0.3 });
    obs.observe(document.getElementById('about'));
})();

// ═══════════════════════════════════════
//  HERO → ABOUT DISSOLVE TRANSITION
// ═══════════════════════════════════════
(() => {
    const heroDissolve = document.getElementById('heroDissolve');
    const hero = document.querySelector('.hero');
    const heroOrbitals = document.getElementById('heroOrbitals');
    const heroGemWrap = document.getElementById('heroGemWrap');
    if (!heroDissolve || !hero) return;

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const heroH = hero.offsetHeight;
            const scrollY = window.pageYOffset;
            const fadeStart = heroH * 0.5;
            const fadeEnd = heroH * 0.95;

            if (scrollY > fadeStart) {
                const progress = Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
                heroDissolve.classList.add('active');
                heroDissolve.style.opacity = progress;

                // Fade hero visual elements
                const fadeOut = 1 - progress;
                if (heroOrbitals) heroOrbitals.style.opacity = fadeOut;
                if (heroGemWrap) heroGemWrap.style.opacity = Math.max(fadeOut, 0.1);
            } else {
                heroDissolve.classList.remove('active');
                heroDissolve.style.opacity = 0;
                if (heroOrbitals) heroOrbitals.style.opacity = '';
                if (heroGemWrap) heroGemWrap.style.opacity = '';
            }
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
})();

// ═══════════════════════════════════════
//  SECTION HINTS (scroll breadcrumbs)
// ═══════════════════════════════════════
(() => {
    const hints = document.querySelectorAll('.section-hint');
    if (!hints.length) return;

    hints.forEach(hint => {
        const section = hint.closest('.section, .hero');
        if (!section) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show hint when section is mostly visible, hide when user scrolls past
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    hint.classList.add('visible');
                } else {
                    hint.classList.remove('visible');
                }
            });
        }, { threshold: [0.3, 0.5, 0.8] });
        obs.observe(section);
    });
})();

// ═══════════════════════════════════════
//  LAB CARD + CREDENTIAL SPOTLIGHT (desktop only)
// ═══════════════════════════════════════
if (hasFineCursor) {
    document.querySelectorAll('.lab-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

// ═══════════════════════════════════════
//  FOOTER GOLD LINE REVEAL
// ═══════════════════════════════════════
const footerEl = document.querySelector('.footer');
if (footerEl) {
    const footerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footerEl.classList.add('footer-revealed');
                footerObs.unobserve(footerEl);
            }
        });
    }, { threshold: 0.2 });
    footerObs.observe(footerEl);
}

// ═══════════════════════════════════════
//  SECTION BREAK GOLD LINE (Lab → Connect)
// ═══════════════════════════════════════
const sectionBreak = document.querySelector('.section-break-connect');
if (sectionBreak) {
    const breakObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionBreak.classList.add('break-revealed');
                breakObs.unobserve(sectionBreak);
            }
        });
    }, { threshold: 0.5 });
    breakObs.observe(sectionBreak);
}

// ═══════════════════════════════════════
//  HERO — CINEMATIC ENTRANCE & EFFECTS
// ═══════════════════════════════════════
const heroEntrance = (() => {
    const hero = document.getElementById('home');
    const cinematic = document.getElementById('heroCinematic');
    const gemCanvas = document.getElementById('heroGemCanvas');
    const particleCanvas = document.getElementById('heroParticles');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let started = false;
    let mouseNX = 0, mouseNY = 0; // normalised -1…1
    let animFrameId = null;

    // ── Mouse tracking ──
    document.addEventListener('mousemove', e => {
        mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── THREE.JS GEM ──
    let gemScene, gemCamera, gemRenderer, gem, wireframe, innerGlow;
    function initGem() {
        if (typeof THREE === 'undefined' || !gemCanvas) return false;
        const size = gemCanvas.parentElement.clientWidth || 420;
        gemScene = new THREE.Scene();
        gemCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        gemCamera.position.z = 5;

        gemRenderer = new THREE.WebGLRenderer({ canvas: gemCanvas, alpha: true, antialias: true });
        gemRenderer.setSize(size, size);
        gemRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Main crystal — dodecahedron for faceted gem look
        const gemGeo = new THREE.DodecahedronGeometry(1.4, 0);
        const gemMat = new THREE.MeshPhongMaterial({
            color: 0x121214,
            specular: 0x3a3020,
            shininess: 30,
            transparent: true,
            opacity: 0.88,
            flatShading: true
        });
        gem = new THREE.Mesh(gemGeo, gemMat);
        gemScene.add(gem);

        // Gold wireframe overlay
        const wireGeo = new THREE.DodecahedronGeometry(1.44, 0);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xc8a45a, wireframe: true,
            transparent: true, opacity: 0.22
        });
        wireframe = new THREE.Mesh(wireGeo, wireMat);
        gemScene.add(wireframe);

        // Inner glow core
        const glowGeo = new THREE.IcosahedronGeometry(0.6, 1);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xc8a45a,
            transparent: true, opacity: 0.03
        });
        innerGlow = new THREE.Mesh(glowGeo, glowMat);
        gemScene.add(innerGlow);

        // Lights
        gemScene.add(new THREE.AmbientLight(0x1a1a2e, 0.6));

        const keyLight = new THREE.PointLight(0xc8a45a, 0.6, 12);
        keyLight.position.set(3, 3, 4);
        gemScene.add(keyLight);

        const fillLight = new THREE.PointLight(0xd4b76a, 0.3, 10);
        fillLight.position.set(-3, -1, 3);
        gemScene.add(fillLight);

        const rimLight = new THREE.PointLight(0xffffff, 0.2, 8);
        rimLight.position.set(0, -3, -2);
        gemScene.add(rimLight);

        return true;
    }

    // Attempt to initialize the gem only when Three.js is available.
    // Polls briefly if the CDN script hasn't executed yet, then initializes particles and the loop.
    function safeInitGem() {
        const wrapper = document.getElementById('heroGemWrap');
        let attempts = 0;
        const tryInit = () => {
            if (typeof THREE !== 'undefined') {
                const ok = initGem();
                try {
                    if (ok) {
                        initParticles();
                        loop();
                        if (wrapper) wrapper.classList.add('gem-ready');
                    }
                } catch (e) {
                    // swallow errors to avoid breaking page; keep poster visible
                    console.warn('Gem init error', e);
                }
                return;
            }
            attempts++;
            if (attempts < 20) setTimeout(tryInit, 150);
        };
        tryInit();
    }

    let gemAngle = 0;
    function updateGem() {
        if (!gem) return;
        gemAngle += 0.004;
        // Autonomous rotation only — no mouse tracking for anchored, weighty feel
        gem.rotation.y = gemAngle;
        gem.rotation.x = Math.sin(gemAngle * 0.5) * 0.15;
        wireframe.rotation.y = gem.rotation.y;
        wireframe.rotation.x = gem.rotation.x;
        innerGlow.rotation.y = -gemAngle * 0.6;
        innerGlow.rotation.x = gemAngle * 0.3;
        // Breathe the inner glow
        innerGlow.material.opacity = 0.02 + Math.sin(gemAngle * 2) * 0.02;
        gemRenderer.render(gemScene, gemCamera);
    }

    // ── PARTICLE SYSTEM ──
    const particles = [];
    let pCtx = null;
    const PARTICLE_COUNT = window.innerWidth < 768 ? 45 : 90;
    const CONNECT_DIST = window.innerWidth < 768 ? 100 : 140;

    function initParticles() {
        if (!particleCanvas) return;
        pCtx = particleCanvas.getContext('2d');
        resizeParticles();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                size: Math.random() * 1.8 + 0.4,
                alpha: Math.random() * 0.45 + 0.08
            });
        }
    }

    function resizeParticles() {
        if (!particleCanvas) return;
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function updateParticles() {
        if (!pCtx) return;
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        const cx = particleCanvas.width / 2 + mouseNX * 60;
        const cy = particleCanvas.height / 2 + mouseNY * 60;

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Gentle mouse repulsion near center
            const dx = p.x - cx, dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 0) {
                const force = (200 - dist) * 0.00015;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Dampen velocity
            p.vx *= 0.999;
            p.vy *= 0.999;

            // Wrap
            if (p.x < -10) p.x = particleCanvas.width + 10;
            if (p.x > particleCanvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = particleCanvas.height + 10;
            if (p.y > particleCanvas.height + 10) p.y = -10;

            // Draw dot
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(200,164,90,${p.alpha})`;
            pCtx.fill();
        }

        // Constellation connections
        pCtx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = dx * dx + dy * dy;
                if (d < CONNECT_DIST * CONNECT_DIST) {
                    const alpha = 0.09 * (1 - Math.sqrt(d) / CONNECT_DIST);
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(200,164,90,${alpha})`;
                    pCtx.stroke();
                }
            }
        }
    }

    // ── MASTER ANIMATION LOOP ──
    let heroVisible = true;
    function loop() {
        if (!heroVisible) { animFrameId = null; return; }
        updateGem();
        updateParticles();
        animFrameId = requestAnimationFrame(loop);
    }

    // Pause hero rendering when off-screen
    const heroVisObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            heroVisible = entry.isIntersecting;
            if (heroVisible && !animFrameId && started) loop();
        });
    }, { threshold: 0.02 });
    if (hero) heroVisObs.observe(hero);

    // ── RESIZE ──
    function onResize() {
        resizeParticles();
        if (gemRenderer && gemCanvas) {
            const size = gemCanvas.parentElement.clientWidth || 420;
            gemRenderer.setSize(size, size);
        }
    }
    window.addEventListener('resize', debounce(onResize, 150));

    // ── ENTRANCE CHOREOGRAPHY ──
    const timers = [];
    function start() {
        if (started) return;
        started = true;

        // Reduced motion: skip straight to visible
        if (reducedMotion) {
            cinematic.style.display = 'none';
            hero.classList.add('entrance-active');
            hero.classList.add('entrance-complete');
            safeInitGem();
            return;
        }

        // Phase 1 — Gold line draws (0ms)
        cinematic.classList.add('phase-line');

        // Phase 2 — Flash burst (900ms)
        timers.push(setTimeout(() => cinematic.classList.add('phase-flash'), 900));

        // Phase 3 — Fade cinematic overlay, reveal scene (1500ms)
        timers.push(setTimeout(() => {
            cinematic.classList.add('phase-fade');
            safeInitGem();
        }, 1500));

        // Phase 4 — Content entrance (2200ms)
        timers.push(setTimeout(() => hero.classList.add('entrance-active'), 2200));

        // Phase 5 — Cleanup (3800ms)
        timers.push(setTimeout(() => {
            hero.classList.add('entrance-complete');
            cinematic.style.display = 'none';
        }, 3800));
    }

    // Skip entrance on scroll / click
    function skip() {
        if (!started || hero.classList.contains('entrance-complete')) return;
        timers.forEach(clearTimeout);
        cinematic.style.display = 'none';
        hero.classList.add('entrance-active', 'entrance-complete');
        if (!gem) { safeInitGem(); }
    }
    window.addEventListener('scroll', skip, { once: true });

    return { start, skip };
})();

console.log('🎯 The Onyx Project — Interactive Systems Loaded');