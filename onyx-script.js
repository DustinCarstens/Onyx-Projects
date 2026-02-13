// ═══════════════════════════════════════
//  ONYX — INTERACTIVE FUNCTIONALITY
// ═══════════════════════════════════════

// ═══ CONSTANTS ═══
const ANIMATION_DURATION = 1500;
const PROJECT_COUNT_TARGET = 4;
const TOOL_COUNT_TARGET = 6;
const DEBOUNCE_DELAY_SCROLL = 10;
const DEBOUNCE_DELAY_NAV = 50;
const STOCK_API_KEY = '041M45P0WTZN93PY'; // Alpha Vantage API key

// ═══ UTILITY FUNCTIONS ═══
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ═══ PAGE LOADER ═══
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 800);
});

// ═══ CUSTOM CURSOR ═══
const hasFineCursor = window.matchMedia('(pointer: fine)').matches;

if (hasFineCursor) {
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('cursorGlow');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .service-card, .lab-card, .nav-dot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorGlow.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            cursorGlow.classList.remove('hovering');
        });
    });
}

// ═══ SCROLL PROGRESS BAR ═══
const scrollProgressBar = document.getElementById('scrollProgressBar');

function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', debounce(updateScrollProgress, DEBOUNCE_DELAY_SCROLL));

// ═══ SECTION NAVIGATION DOTS ═══
const sections = document.querySelectorAll('.hero, .about, .tableau-section, .services, .live-lab, .credentials, .cta-section');
const navDots = document.querySelectorAll('.nav-dot');

function updateActiveSection() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === current) {
            dot.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveSection, DEBOUNCE_DELAY_NAV));

// ═══ BACK TO TOP BUTTON ═══
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

window.addEventListener('scroll', debounce(updateBackToTop, DEBOUNCE_DELAY_NAV));

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ═══ PARALLAX EFFECT ═══
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

window.addEventListener('scroll', debounce(updateParallax, DEBOUNCE_DELAY_SCROLL));

// ═══ MAGNETIC BUTTONS ═══
if (hasFineCursor) {
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-ghost, .tool-btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ═══ SUCCESS FLASH ANIMATION ═══
function showSuccess(element) {
    element.classList.add('success-flash');
    setTimeout(() => element.classList.remove('success-flash'), 1000);
}

// ═══ LOGO SCROLL TO TOP ═══
const navLogo = document.getElementById('navLogo');
if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ═══ NAVIGATION ═══
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
});

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
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = nav.offsetHeight + 20;
            const pos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});

// ═══ HERO STATS ANIMATION ═══
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const projectCount = document.getElementById('projectCount');
            const toolCount = document.getElementById('toolCount');
            if (projectCount && toolCount) {
                animateValue(projectCount, 0, PROJECT_COUNT_TARGET, ANIMATION_DURATION);
                animateValue(toolCount, 0, TOOL_COUNT_TARGET, ANIMATION_DURATION);
                heroObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ═══ PROJECT MODAL ═══
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = modal.querySelector('.modal-close');
const modalOverlay = modal.querySelector('.modal-overlay');

const projectData = {
    dashboards: {
        title: "Interactive Dashboards",
        content: `
            <div class="modal-section">
                <h4>Overview</h4>
                <p class="modal-subtitle">Embedded Tableau visualizations that transform raw data into interactive stories. Users can filter, drill down, and explore insights directly without leaving the page.</p>
            </div>
            
            <div class="modal-section">
                <h4>Key Features</h4>
                <ul class="modal-list">
                    <li>Real-time data filtering and interaction</li>
                    <li>Mobile-responsive dashboard design</li>
                    <li>Custom calculated fields and parameters</li>
                    <li>Cross-filtering between multiple visualizations</li>
                    <li>Export and sharing capabilities</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>Technologies</h4>
                <p class="modal-subtitle">Built with Tableau Public, embedded using the Tableau JavaScript API, with custom CSS for seamless integration into the site's design system.</p>
            </div>
            
            <div class="modal-section">
                <a href="#dashboard" class="btn-primary" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.style.overflow = '';">View Live Dashboard</a>
            </div>
        `
    },
    tools: {
        title: "Live Web Tools",
        content: `
            <div class="modal-section">
                <h4>Overview</h4>
                <p class="modal-subtitle">Client-side JavaScript tools that run entirely in the browser. No backend required, instant results, and complete data privacy.</p>
            </div>
            
            <div class="modal-section">
                <h4>Available Tools</h4>
                <ul class="modal-list">
                    <li><strong>Weather Dashboard:</strong> Real-time weather data with OpenWeather API integration</li>
                    <li><strong>Data Calculator:</strong> Statistical analysis on pasted number sets</li>
                    <li><strong>Unit Converter:</strong> Multi-category conversion (temperature, length, weight, volume, speed)</li>
                    <li><strong>Stock Lookup:</strong> Real-time stock quotes via Alpha Vantage API</li>
                    <li><strong>Text Analytics:</strong> Word count, character count, and reading time estimation</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>Design Approach</h4>
                <p class="modal-subtitle">Each tool is designed to be immediately useful without explanation. No signup, no configuration, no friction — just results.</p>
            </div>
            
            <div class="modal-section">
                <a href="#lab" class="btn-primary" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.style.overflow = '';">Try the Tools</a>
            </div>
        `
    },
    website: {
        title: "Same Day Locksmith KC",
        content: `
            <div class="modal-section">
                <h4>Overview</h4>
                <p class="modal-subtitle">Full-stack website development for a local locksmith business, featuring custom booking integration, mobile-first design, and API-powered functionality.</p>
            </div>
            
            <div class="modal-section">
                <h4>Technical Implementation</h4>
                <ul class="modal-list">
                    <li><strong>Backend:</strong> Cloudflare Workers for serverless API integration</li>
                    <li><strong>Booking System:</strong> WorkIZ API integration with OAuth authentication</li>
                    <li><strong>Maps:</strong> Custom Google Maps implementation with service area visualization</li>
                    <li><strong>Design:</strong> Glassmorphism UI with premium aesthetic and mobile optimization</li>
                    <li><strong>Performance:</strong> Optimized assets, lazy loading, and edge caching</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>Results</h4>
                <p class="modal-subtitle">Successful launch with 5.0 Google rating, improved mobile conversion rate, and seamless booking experience for emergency service requests.</p>
            </div>
            
            <div class="modal-section">
                <a href="https://www.samedaylocksmithkc.com" target="_blank" rel="noopener noreferrer" class="btn-primary">Visit Live Site</a>
            </div>
        `
    },
    automation: {
        title: "Data Pipeline Automation",
        content: `
            <div class="modal-section">
                <h4>Overview</h4>
                <p class="modal-subtitle">ETL workflows and automation scripts that transform repetitive data tasks into reliable, scheduled processes.</p>
            </div>
            
            <div class="modal-section">
                <h4>Capabilities</h4>
                <ul class="modal-list">
                    <li><strong>Data Extraction:</strong> API connections, database queries, and file parsing</li>
                    <li><strong>Transformation:</strong> Data cleaning, normalization, and enrichment with pandas</li>
                    <li><strong>Loading:</strong> Database writes, report generation, and stakeholder distribution</li>
                    <li><strong>Scheduling:</strong> Automated execution with error handling and notifications</li>
                    <li><strong>Monitoring:</strong> Logging, alerting, and performance tracking</li>
                </ul>
            </div>
            
            <div class="modal-section">
                <h4>Stack</h4>
                <p class="modal-subtitle">Python (pandas, requests, sqlalchemy), SQL, scheduled execution via cron or Windows Task Scheduler, with Slack/email notifications for monitoring.</p>
            </div>
            
            <div class="modal-section">
                <a href="#connect" class="btn-primary" onclick="document.getElementById('projectModal').classList.remove('active'); document.body.style.overflow = '';">Discuss Your Project</a>
            </div>
        `
    }
};

// Open modal
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const project = card.dataset.project;
        if (projectData[project]) {
            modalTitle.textContent = projectData[project].title;
            modalBody.innerHTML = projectData[project].content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ═══ WEATHER TOOL ═══
const weatherBtn = document.getElementById('weatherBtn');
const weatherCity = document.getElementById('weatherCity');
const weatherResult = document.getElementById('weatherResult');

// Get a FREE API key from: https://openweathermap.org/api
const WEATHER_API_KEY = ''; // Add your OpenWeather API key here

weatherBtn.addEventListener('click', async () => {
    const city = weatherCity.value.trim();
    if (!city) {
        weatherResult.innerHTML = '<div style="color: #f44336;">Please enter a city name</div>';
        return;
    }
    
    if (!WEATHER_API_KEY) {
        weatherResult.innerHTML = '<div style="color: var(--gold);">To enable live weather data, add your free OpenWeather API key in onyx-script.js.<br><br><a href="https://openweathermap.org/api" target="_blank" style="color: var(--gold); text-decoration: underline;">Get a free key here →</a></div>';
        return;
    }
    
    weatherResult.innerHTML = '<div class="loading">Fetching weather data...</div>';
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=imperial`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.cod !== 200) {
            throw new Error(data.message || 'City not found');
        }
        
        displayWeatherData(data);
        
    } catch (error) {
        weatherResult.innerHTML = `<div style="color: #f44336;">${error.message}</div>`;
    }
});

function displayWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    
    weatherResult.innerHTML = `
        <div class="weather-data">
            <div class="weather-header">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <div>
                    <div class="weather-city">${data.name}, ${data.sys.country}</div>
                    <div class="weather-desc">${description}</div>
                </div>
            </div>
            <div class="weather-temp">${temp}°F</div>
            <div class="weather-feels">Feels like ${feelsLike}°F</div>
            <div class="weather-details">
                <div><strong>Humidity:</strong> ${data.main.humidity}%</div>
                <div><strong>Wind:</strong> ${Math.round(data.wind.speed)} mph</div>
            </div>
        </div>
    `;
    showSuccess(weatherResult);
}

// Allow Enter key to submit
weatherCity.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        weatherBtn.click();
    }
});

// ═══ DATA CALCULATOR ═══
const dataInput = document.getElementById('dataInput');
const calculateBtn = document.getElementById('calculateBtn');
const calcResult = document.getElementById('calcResult');

calculateBtn.addEventListener('click', () => {
    const input = dataInput.value.trim();
    if (!input) {
        calcResult.innerHTML = '<div style="color: #f44336;">Please enter some numbers</div>';
        return;
    }
    
    try {
        const numbers = input.split(/[,\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        
        if (numbers.length === 0) {
            throw new Error('No valid numbers found');
        }
        
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const range = max - min;
        
        calcResult.innerHTML = `
            <div class="calc-stats">
                <div class="calc-stat">
                    <div class="calc-stat-label">Count</div>
                    <div class="calc-stat-value">${numbers.length}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Sum</div>
                    <div class="calc-stat-value">${sum.toFixed(2)}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Mean</div>
                    <div class="calc-stat-value">${mean.toFixed(2)}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Median</div>
                    <div class="calc-stat-value">${median.toFixed(2)}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Min</div>
                    <div class="calc-stat-value">${min.toFixed(2)}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Max</div>
                    <div class="calc-stat-value">${max.toFixed(2)}</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat-label">Range</div>
                    <div class="calc-stat-value">${range.toFixed(2)}</div>
                </div>
            </div>
        `;
        showSuccess(calcResult);
        
    } catch (error) {
        calcResult.innerHTML = `<div style="color: #f44336;">${error.message}</div>`;
    }
});

// ═══ UNIT CONVERTER ═══
const unitCategory = document.getElementById('unitCategory');
const fromValue = document.getElementById('fromValue');
const fromUnit = document.getElementById('fromUnit');
const toValue = document.getElementById('toValue');
const toUnit = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');

const conversionData = {
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        conversions: {
            'Celsius-Fahrenheit': (c) => (c * 9/5) + 32,
            'Fahrenheit-Celsius': (f) => (f - 32) * 5/9,
            'Celsius-Kelvin': (c) => c + 273.15,
            'Kelvin-Celsius': (k) => k - 273.15,
            'Fahrenheit-Kelvin': (f) => (f - 32) * 5/9 + 273.15,
            'Kelvin-Fahrenheit': (k) => (k - 273.15) * 9/5 + 32
        }
    },
    length: {
        units: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches', 'Centimeters'],
        toBase: {
            'Meters': 1,
            'Kilometers': 1000,
            'Miles': 1609.34,
            'Feet': 0.3048,
            'Inches': 0.0254,
            'Centimeters': 0.01
        }
    },
    weight: {
        units: ['Kilograms', 'Grams', 'Pounds', 'Ounces', 'Tons'],
        toBase: {
            'Kilograms': 1,
            'Grams': 0.001,
            'Pounds': 0.453592,
            'Ounces': 0.0283495,
            'Tons': 1000
        }
    },
    volume: {
        units: ['Liters', 'Milliliters', 'Gallons', 'Quarts', 'Cups', 'Fluid Ounces'],
        toBase: {
            'Liters': 1,
            'Milliliters': 0.001,
            'Gallons': 3.78541,
            'Quarts': 0.946353,
            'Cups': 0.236588,
            'Fluid Ounces': 0.0295735
        }
    },
    speed: {
        units: ['Meters/Second', 'Kilometers/Hour', 'Miles/Hour', 'Knots'],
        toBase: {
            'Meters/Second': 1,
            'Kilometers/Hour': 0.277778,
            'Miles/Hour': 0.44704,
            'Knots': 0.514444
        }
    }
};

function populateUnits(category) {
    const data = conversionData[category];
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    data.units.forEach(unit => {
        fromUnit.add(new Option(unit, unit));
        toUnit.add(new Option(unit, unit));
    });
    
    if (data.units.length > 1) {
        toUnit.selectedIndex = 1;
    }
    
    convertUnits();
}

function convertUnits() {
    const value = parseFloat(fromValue.value);
    const category = unitCategory.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    
    if (isNaN(value) || from === to) {
        toValue.value = fromValue.value;
        return;
    }
    
    const data = conversionData[category];
    let result;
    
    if (category === 'temperature') {
        const conversionKey = `${from}-${to}`;
        result = data.conversions[conversionKey](value);
    } else {
        // Convert to base unit, then to target unit
        const inBase = value * data.toBase[from];
        result = inBase / data.toBase[to];
    }
    
    toValue.value = result.toFixed(4);
}

function swapUnits() {
    const tempValue = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempValue;
    
    const tempInputValue = fromValue.value;
    fromValue.value = toValue.value;
    
    convertUnits();
}

// Event listeners
unitCategory.addEventListener('change', () => populateUnits(unitCategory.value));
fromValue.addEventListener('input', convertUnits);
fromUnit.addEventListener('change', convertUnits);
toUnit.addEventListener('change', convertUnits);
swapBtn.addEventListener('click', swapUnits);

// Initialize with temperature
populateUnits('temperature');

// ═══ STOCK LOOKUP TOOL ═══
const stockBtn = document.getElementById('stockBtn');
const stockSymbol = document.getElementById('stockSymbol');
const stockResult = document.getElementById('stockResult');

stockBtn.addEventListener('click', async () => {
    const symbol = stockSymbol.value.trim().toUpperCase();
    if (!symbol) {
        stockResult.innerHTML = '<div style="color: #f44336;">Please enter a stock symbol</div>';
        return;
    }
    
    if (!STOCK_API_KEY) {
        stockResult.innerHTML = '<div style="color: var(--gold);">To enable live stock data, add your free Alpha Vantage API key in onyx-script.js.<br><br><a href="https://www.alphavantage.co/support/#api-key" target="_blank" style="color: var(--gold); text-decoration: underline;">Get a free key here →</a></div>';
        return;
    }
    
    stockResult.innerHTML = '<div class="loading">Fetching stock data...</div>';
    
    try {
        const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCK_API_KEY}`;
        const response = await fetch(quoteUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Error Message']) {
            throw new Error('Invalid symbol. Please check the ticker and try again.');
        }
        
        if (data['Note'] || data['Information']) {
            throw new Error('API rate limit reached. Free tier allows 25 requests/day. Please try again later.');
        }
        
        const quote = data['Global Quote'];
        
        if (!quote || Object.keys(quote).length === 0) {
            throw new Error('No data available for this symbol.');
        }
        
        const stockData = {
            symbol: quote['01. symbol'],
            name: getCompanyName(symbol),
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            open: parseFloat(quote['02. open']),
            previousClose: parseFloat(quote['08. previous close']),
            volume: parseInt(quote['06. volume']).toLocaleString(),
            timestamp: new Date(quote['07. latest trading day']).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
        
        displayStockData(stockData);
        
    } catch (error) {
        stockResult.innerHTML = `<div style="color: #f44336;">${error.message}</div>`;
    }
});

function displayStockData(data) {
    const isPositive = data.change >= 0;
    const arrow = isPositive ? '▲' : '▼';
    
    stockResult.innerHTML = `
        <div class="stock-data">
            <div class="stock-header">
                <span class="stock-symbol">${data.symbol}</span>
                <span class="stock-name">${data.name}</span>
            </div>
            <div>
                <div class="stock-price">$${data.price.toFixed(2)}</div>
                <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
                    ${arrow} ${Math.abs(data.change).toFixed(2)} (${Math.abs(data.changePercent).toFixed(2)}%)
                </div>
            </div>
            <div class="stock-metrics">
                <div class="stock-metric">
                    <span class="stock-metric-label">Open</span>
                    <span class="stock-metric-value">$${data.open.toFixed(2)}</span>
                </div>
                <div class="stock-metric">
                    <span class="stock-metric-label">Prev Close</span>
                    <span class="stock-metric-value">$${data.previousClose.toFixed(2)}</span>
                </div>
                <div class="stock-metric">
                    <span class="stock-metric-label">Day High</span>
                    <span class="stock-metric-value">$${data.high.toFixed(2)}</span>
                </div>
                <div class="stock-metric">
                    <span class="stock-metric-label">Day Low</span>
                    <span class="stock-metric-value">$${data.low.toFixed(2)}</span>
                </div>
                <div class="stock-metric" style="grid-column: 1 / -1;">
                    <span class="stock-metric-label">Volume</span>
                    <span class="stock-metric-value">${data.volume}</span>
                </div>
            </div>
            <div class="stock-timestamp">${data.timestamp}</div>
        </div>
    `;
    showSuccess(stockResult);
}

function getCompanyName(symbol) {
    const companies = {
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corporation',
        'GOOGL': 'Alphabet Inc.',
        'AMZN': 'Amazon.com Inc.',
        'TSLA': 'Tesla Inc.',
        'META': 'Meta Platforms Inc.',
        'NVDA': 'NVIDIA Corporation',
        'JPM': 'JPMorgan Chase & Co.',
        'V': 'Visa Inc.',
        'WMT': 'Walmart Inc.',
        'PFE': 'Pfizer Inc.',
        'DIS': 'The Walt Disney Company',
        'NFLX': 'Netflix Inc.',
        'BA': 'Boeing Company',
        'NKE': 'Nike Inc.'
    };
    return companies[symbol] || `${symbol} Corporation`;
}

// Allow Enter key to submit
stockSymbol.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        stockBtn.click();
    }
});

// ═══ TEXT ANALYTICS ═══
const textInput = document.getElementById('textInput');
const textResult = document.getElementById('textResult');

textInput.addEventListener('input', () => {
    const text = textInput.value;
    
    if (!text.trim()) {
        textResult.innerHTML = '';
        return;
    }
    
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words.length / 200); // Average reading speed: 200 words/min
    
    textResult.innerHTML = `
        <div class="text-stat">
            <div class="text-stat-value">${words.length}</div>
            <div class="text-stat-label">Words</div>
        </div>
        <div class="text-stat">
            <div class="text-stat-value">${characters}</div>
            <div class="text-stat-label">Characters</div>
        </div>
        <div class="text-stat">
            <div class="text-stat-value">${charactersNoSpaces}</div>
            <div class="text-stat-label">No Spaces</div>
        </div>
        <div class="text-stat">
            <div class="text-stat-value">${sentences}</div>
            <div class="text-stat-label">Sentences</div>
        </div>
        <div class="text-stat">
            <div class="text-stat-value">${paragraphs}</div>
            <div class="text-stat-label">Paragraphs</div>
        </div>
        <div class="text-stat">
            <div class="text-stat-value">${readingTime}</div>
            <div class="text-stat-label">Min Read</div>
        </div>
    `;
});

// Initialize and log
console.log('🎯 Onyx Interactive Systems Loaded');