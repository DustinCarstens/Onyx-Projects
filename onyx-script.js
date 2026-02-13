// ═══════════════════════════════════════
//  ONYX — INTERACTIVE FUNCTIONALITY
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
    }, 800);
});

// ═══ CUSTOM CURSOR ═══
const hasFineCursor = window.matchMedia('(pointer: fine)').matches;
if (hasFineCursor) {
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
        cursorGlow.style.left = cursorX + 'px'; cursorGlow.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, input, select, textarea, .lab-card, .nav-dot, .carousel-dot, .resource-card').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); cursorGlow.classList.add('hovering'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); cursorGlow.classList.remove('hovering'); });
    });
}

// ═══ SCROLL PROGRESS ═══
const scrollProgressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', debounce(() => {
    const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    scrollProgressBar.style.width = scrolled + '%';
}, 10));

// ═══ SECTION NAV DOTS ═══
const allSections = document.querySelectorAll('.hero, .about, .carousel-section, .tableau-section, .live-lab, .credentials, .cta-section');
const navDots = document.querySelectorAll('.nav-dot');
const mobNavItems = document.querySelectorAll('.mob-nav-item');

function updateActiveSection() {
    let current = '';
    allSections.forEach(s => {
        if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navDots.forEach(d => { d.classList.toggle('active', d.getAttribute('data-target') === current); });
    // Mobile bottom nav
    const mobMap = { home: 'home', about: 'home', work: 'work', dashboard: 'work', lab: 'lab', toolkit: 'lab', connect: 'connect' };
    const mobTarget = mobMap[current] || 'home';
    mobNavItems.forEach(m => m.classList.toggle('active', m.getAttribute('data-target') === mobTarget));
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

// ═══ MAGNETIC BUTTONS ═══
if (hasFineCursor) {
    document.querySelectorAll('.btn-primary, .btn-ghost, .tool-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - r.left - r.width/2)*0.2}px, ${(e.clientY - r.top - r.height/2)*0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
    });
}

// ═══ SUCCESS FLASH ═══
function showSuccess(el) { el.classList.add('success-flash'); setTimeout(() => el.classList.remove('success-flash'), 1000); }

// ═══ SKELETON LOADER ═══
function showSkeleton(el) {
    el.innerHTML = '<div class="skeleton"><div class="skeleton-line" style="width:100%"></div><div class="skeleton-line" style="width:80%"></div><div class="skeleton-line" style="width:60%"></div></div>';
}

// ═══ LOGO SCROLL TO TOP ═══
const navLogo = document.getElementById('navLogo');
if (navLogo) navLogo.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ═══ NAVIGATION ═══
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80));

navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    });
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

// ═══ HERO COUNTER ANIMATION ═══
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
const heroEl = document.querySelector('.hero');
if (heroEl) counterObserver.observe(heroEl);

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
    autoDelay: 7000,
    touchStartX: 0,
    touchEndX: 0,

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
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }

        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

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

        // Keyboard
        document.addEventListener('keydown', e => {
            const carouselRect = document.getElementById('work')?.getBoundingClientRect();
            if (!carouselRect || carouselRect.top > window.innerHeight || carouselRect.bottom < 0) return;
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        this.update();
        this.startAuto();
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
    },

    startAuto() {
        this.stopAuto();
        this.autoTimer = setInterval(() => this.next(), this.autoDelay);
    },

    stopAuto() {
        if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; }
    }
};
carousel.init();

// ═══════════════════════════════════════
//  LAB TABS
// ═══════════════════════════════════════
document.querySelectorAll('.lab-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        // Update tabs
        document.querySelectorAll('.lab-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        // Update panels
        document.querySelectorAll('.lab-panel').forEach(p => p.classList.remove('active'));
        const panel = document.querySelector(`.lab-panel[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
    });
});

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
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results?.length) throw new Error('City not found');
        const { latitude, longitude, name: cityName, country } = geoData.results[0];
        
        // Weather
        const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`);
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
//  UNIT CONVERTER
// ═══════════════════════════════════════
const conversionData = {
    temperature: { units: ['Celsius','Fahrenheit','Kelvin'], conversions: { 'Celsius-Fahrenheit': c=>(c*9/5)+32, 'Fahrenheit-Celsius': f=>(f-32)*5/9, 'Celsius-Kelvin': c=>c+273.15, 'Kelvin-Celsius': k=>k-273.15, 'Fahrenheit-Kelvin': f=>(f-32)*5/9+273.15, 'Kelvin-Fahrenheit': k=>(k-273.15)*9/5+32 }},
    length: { units: ['Meters','Kilometers','Miles','Feet','Inches','Centimeters'], toBase: { Meters:1, Kilometers:1000, Miles:1609.34, Feet:0.3048, Inches:0.0254, Centimeters:0.01 }},
    weight: { units: ['Kilograms','Grams','Pounds','Ounces','Tons'], toBase: { Kilograms:1, Grams:0.001, Pounds:0.453592, Ounces:0.0283495, Tons:1000 }},
    volume: { units: ['Liters','Milliliters','Gallons','Quarts','Cups','Fluid Ounces'], toBase: { Liters:1, Milliliters:0.001, Gallons:3.78541, Quarts:0.946353, Cups:0.236588, 'Fluid Ounces':0.0295735 }},
    speed: { units: ['Meters/Second','Kilometers/Hour','Miles/Hour','Knots'], toBase: { 'Meters/Second':1, 'Kilometers/Hour':0.277778, 'Miles/Hour':0.44704, Knots:0.514444 }}
};

const unitCat = document.getElementById('unitCategory'), fromVal = document.getElementById('fromValue'), fromUn = document.getElementById('fromUnit'), toVal = document.getElementById('toValue'), toUn = document.getElementById('toUnit');

function populateUnits(cat) {
    const d = conversionData[cat]; fromUn.innerHTML = ''; toUn.innerHTML = '';
    d.units.forEach(u => { fromUn.add(new Option(u,u)); toUn.add(new Option(u,u)); });
    if (d.units.length > 1) toUn.selectedIndex = 1;
    convertUnits();
}

function convertUnits() {
    const v = parseFloat(fromVal.value), cat = unitCat.value, from = fromUn.value, to = toUn.value;
    if (isNaN(v) || from === to) { toVal.value = fromVal.value; return; }
    const d = conversionData[cat];
    let result;
    if (cat === 'temperature') { result = d.conversions[`${from}-${to}`](v); }
    else { result = (v * d.toBase[from]) / d.toBase[to]; }
    toVal.value = result.toFixed(4);
}

unitCat.addEventListener('change', () => populateUnits(unitCat.value));
fromVal.addEventListener('input', convertUnits);
fromUn.addEventListener('change', convertUnits);
toUn.addEventListener('change', convertUnits);
document.getElementById('swapBtn').addEventListener('click', () => {
    const t = fromUn.value; fromUn.value = toUn.value; toUn.value = t;
    fromVal.value = toVal.value; convertUnits();
});
populateUnits('temperature');

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
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${STOCK_API_KEY}`);
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

console.log('🎯 Onyx Interactive Systems Loaded');