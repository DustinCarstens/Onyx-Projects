/* Onyx AI — landing page script */

(function () {
    'use strict';

    const AI_ORIGIN = 'https://ai.the-onyx-project.com';
    const STATUS_TIMEOUT_MS = 4000;

    function pingServer() {
        const pill = document.getElementById('aiStatus');
        const label = document.getElementById('aiStatusLabel');
        if (!pill || !label) return;

        // Image-load probe against the chat server's favicon.
        // Works cross-origin without CORS. If the origin is offline, Cloudflare
        // returns 5xx HTML which fails to decode as an image -> onerror.
        const img = new Image();
        let settled = false;

        const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            setOffline();
        }, STATUS_TIMEOUT_MS);

        img.onload = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            setOnline();
        };
        img.onerror = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            setOffline();
        };
        img.src = `${AI_ORIGIN}/onyx-ai-online.ico?_=${Date.now()}`;

        function setOnline() {
            pill.classList.remove('offline');
            pill.classList.add('online');
            label.textContent = 'server online';
        }
        function setOffline() {
            pill.classList.remove('online');
            pill.classList.add('offline');
            label.textContent = 'server offline';
        }
    }

    function initNavScroll() {
        const nav = document.querySelector('.ai-nav');
        if (!nav) return;
        const onScroll = () => {
            if (window.scrollY > 20) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initNavToggle() {
        const toggle = document.getElementById('aiNavToggle');
        const links = document.getElementById('aiNavLinks');
        if (!toggle || !links) return;

        const setOpen = (open) => {
            links.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };
        setOpen(false);

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setOpen(!links.classList.contains('open'));
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => setOpen(false));
        });
        // Outside tap / click closes
        document.addEventListener('click', (e) => {
            if (!links.classList.contains('open')) return;
            if (links.contains(e.target) || toggle.contains(e.target)) return;
            setOpen(false);
        });
        // Escape closes and restores focus to the toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && links.classList.contains('open')) {
                setOpen(false);
                toggle.focus();
            }
        });
    }

    function initReveal() {
        const targets = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window) || targets.length === 0) {
            targets.forEach(t => t.classList.add('visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        targets.forEach(t => io.observe(t));
    }

    function initNetwork() {
        const canvas = document.getElementById('aiNetworkCanvas');
        if (!canvas) return;
        // Skip the canvas entirely on small/touch devices — perf + battery win,
        // the grid background + glow already carry the look on mobile.
        const isMobile = window.matchMedia('(max-width: 768px)').matches
            || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        if (isMobile) { canvas.style.display = 'none'; return; }
        const ctx = canvas.getContext('2d');
        let w, h, nodes = [], mouse = { x: -9999, y: -9999 }, raf;
        const NODE_COUNT = 55;
        const CONNECT_DIST = 220;
        const MOUSE_RADIUS = 250;
        const MOUSE_PUSH = 0.6;
        const BASE_SPEED = 0.12;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            w = window.innerWidth; h = window.innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createNodes() {
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                const isHub = Math.random() < 0.15;
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * BASE_SPEED,
                    vy: (Math.random() - 0.5) * BASE_SPEED,
                    r: isHub ? (Math.random() * 1.5 + 2.5) : (Math.random() * 1.2 + 0.6),
                    hub: isHub,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.01 + 0.004,
                    brightness: isHub ? 1 : (Math.random() * 0.5 + 0.4)
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            const cR = 218, cG = 185, cB = 110;
            const bR = 255, bG = 240, bB = 200;

            for (const n of nodes) {
                const dx = n.x - mouse.x, dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (1 - dist / MOUSE_RADIUS) * MOUSE_PUSH;
                    n.vx += (dx / dist) * force;
                    n.vy += (dy / dist) * force;
                }
                n.x += n.vx;
                n.y += n.vy;
                n.vx *= 0.994;
                n.vy *= 0.994;
                const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
                if (speed < BASE_SPEED * 0.4) {
                    n.vx += (Math.random() - 0.5) * 0.015;
                    n.vy += (Math.random() - 0.5) * 0.015;
                }
                if (n.x < -60) n.x = w + 60;
                if (n.x > w + 60) n.x = -60;
                if (n.y < -60) n.y = h + 60;
                if (n.y > h + 60) n.y = -60;
                n.pulse += n.pulseSpeed;
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const fade = 1 - dist / CONNECT_DIST;
                        const avgBright = (a.brightness + b.brightness) / 2;
                        const hubBoost = (a.hub || b.hub) ? 1.5 : 1;
                        const alpha = fade * fade * 0.18 * avgBright * hubBoost;
                        const lw = fade * 1.0 * hubBoost;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${cR},${cG},${cB},${alpha})`;
                        ctx.lineWidth = lw;
                        ctx.stroke();
                    }
                }
            }

            for (const n of nodes) {
                const p = 0.65 + Math.sin(n.pulse) * 0.35;
                const r = n.r * p;
                const bright = n.brightness * p;

                if (n.hub) {
                    const g1 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 12);
                    g1.addColorStop(0, `rgba(${cR},${cG},${cB},${0.08 * bright})`);
                    g1.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                    ctx.beginPath(); ctx.arc(n.x, n.y, r * 12, 0, Math.PI * 2);
                    ctx.fillStyle = g1; ctx.fill();

                    const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
                    g2.addColorStop(0, `rgba(${bR},${bG},${bB},${0.25 * bright})`);
                    g2.addColorStop(0.3, `rgba(${cR},${cG},${cB},${0.15 * bright})`);
                    g2.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                    ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
                    ctx.fillStyle = g2; ctx.fill();

                    const g3 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 1.2);
                    g3.addColorStop(0, `rgba(${bR},${bG},${bB},${0.9 * bright})`);
                    g3.addColorStop(0.5, `rgba(${cR},${cG},${cB},${0.5 * bright})`);
                    g3.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                    ctx.beginPath(); ctx.arc(n.x, n.y, r * 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = g3; ctx.fill();
                } else {
                    const g1 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
                    g1.addColorStop(0, `rgba(${cR},${cG},${cB},${0.06 * bright})`);
                    g1.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                    ctx.beginPath(); ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
                    ctx.fillStyle = g1; ctx.fill();

                    const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 1.5);
                    g2.addColorStop(0, `rgba(${bR},${bG},${bB},${0.65 * bright})`);
                    g2.addColorStop(0.6, `rgba(${cR},${cG},${cB},${0.3 * bright})`);
                    g2.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                    ctx.beginPath(); ctx.arc(n.x, n.y, r * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = g2; ctx.fill();
                }
            }

            if (mouse.x > 0 && mouse.y > 0) {
                const nearby = [];
                for (const n of nodes) {
                    const dx = n.x - mouse.x, dy = n.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        nearby.push({ node: n, dist });
                        const fade = 1 - dist / MOUSE_RADIUS;
                        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
                        gr.addColorStop(0, `rgba(${bR},${bG},${bB},${fade * 0.2})`);
                        gr.addColorStop(0.4, `rgba(${cR},${cG},${cB},${fade * 0.08})`);
                        gr.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
                        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
                        ctx.fillStyle = gr; ctx.fill();
                    }
                }
                for (let i = 0; i < nearby.length; i++) {
                    for (let j = i + 1; j < nearby.length; j++) {
                        const a = nearby[i].node, b = nearby[j].node;
                        const dx = a.x - b.x, dy = a.y - b.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < CONNECT_DIST * 1.3) {
                            const fade = (1 - d / (CONNECT_DIST * 1.3));
                            const mfade = Math.min((1 - nearby[i].dist / MOUSE_RADIUS), (1 - nearby[j].dist / MOUSE_RADIUS));
                            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                            ctx.strokeStyle = `rgba(${cR},${cG},${cB},${fade * mfade * 0.15})`;
                            ctx.lineWidth = fade * 0.6;
                            ctx.stroke();
                        }
                    }
                }
            }

            raf = requestAnimationFrame(draw);
        }

        document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
        window.addEventListener('resize', () => { resize(); if (nodes.length === 0) createNodes(); });

        resize();
        createNodes();
        draw();
    }

    function initPreviewSidebar() {
        const preview = document.getElementById('aiPreview');
        if (!preview) return;
        const toggles = preview.querySelectorAll('[data-sidebar-toggle]');
        toggles.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                preview.classList.toggle('sidebar-collapsed');
            });
        });
        // Any button inside the sidebar shouldn't bubble to parent anchors/cards.
        preview.querySelectorAll('.ai-preview-sidebar button, .ai-preview-sidebar-item, .ai-preview-sidebar-user').forEach(el => {
            el.addEventListener('click', e => e.stopPropagation());
        });
    }

    function initCardSpotlight() {
        const cards = document.querySelectorAll('.ai-preview-card');
        cards.forEach(card => {
            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--mx', '-200px');
                card.style.setProperty('--my', '-200px');
            });
        });
    }

    function init() {
        pingServer();
        initNavScroll();
        initNavToggle();
        initReveal();
        initNetwork();
        initCardSpotlight();
        initPreviewSidebar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
