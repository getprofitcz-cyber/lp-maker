/**
 * GETPROFIT Blog JavaScript
 * TOC tracking, section visibility, CAPI, form handling, sticky CTA
 */

(function () {
    'use strict';

    // ===================================
    // Config
    // ===================================
    var CAPI_ENDPOINT = 'https://t.getprofit.co.ua/api/fb-capi';
    var FORM_WEBHOOK = 'https://hook.eu1.make.com/x7v7qun7m8mogbtm8d1dv7x833ydp23i';
    var FB_PIXEL_ID = '835834350805511';

    // ===================================
    // Utility
    // ===================================

    function generateEventId() {
        return 'eid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    function getUTMParams() {
        var params = {};
        var search = window.location.search;
        if (!search) return params;
        var pairs = search.substring(1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var kv = pairs[i].split('=');
            var key = decodeURIComponent(kv[0]);
            if (key.indexOf('utm_') === 0 || key === 'fbclid' || key === 'gclid') {
                params[key] = decodeURIComponent(kv[1] || '');
            }
        }
        return params;
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    }

    function hashSHA256(value) {
        if (!value || typeof crypto === 'undefined' || !crypto.subtle) return Promise.resolve('');
        var normalized = value.trim().toLowerCase();
        var encoder = new TextEncoder();
        return crypto.subtle.digest('SHA-256', encoder.encode(normalized)).then(function (buf) {
            return Array.from(new Uint8Array(buf)).map(function (b) {
                return b.toString(16).padStart(2, '0');
            }).join('');
        });
    }

    // ===================================
    // DataLayer & CAPI
    // ===================================

    window.dataLayer = window.dataLayer || [];

    function pushDataLayer(event, data) {
        var payload = Object.assign({ event: event }, data || {});
        window.dataLayer.push(payload);
    }

    function sendCAPI(eventName, userData, customData) {
        var eventId = generateEventId();
        var payload = {
            data: [{
                event_name: eventName,
                event_id: eventId,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: window.location.href,
                action_source: 'website',
                user_data: userData || {},
                custom_data: customData || {}
            }]
        };

        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(CAPI_ENDPOINT, new Blob([JSON.stringify(payload)], { type: 'text/plain' }));
            } else {
                fetch(CAPI_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                });
            }
        } catch (e) {
            // silently fail
        }

        return eventId;
    }

    // ===================================
    // PageView Event
    // ===================================

    function initPageView() {
        var pvId = generateEventId();
        pushDataLayer('capi_pageview', { fb_event_id: pvId });

        sendCAPI('PageView', {
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc') || getUTMParams().fbclid
        }, {
            content_name: document.title,
            content_category: 'blog'
        });
    }

    // ===================================
    // Reading Progress Bar
    // ===================================

    function initReadingProgress() {
        var bar = document.querySelector('.reading-progress');
        if (!bar) return;

        var article = document.querySelector('.article-content');
        if (!article) return;

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var articleTop = article.offsetTop;
                    var articleHeight = article.offsetHeight;
                    var scrolled = window.scrollY - articleTop;
                    var progress = Math.max(0, Math.min(100, (scrolled / (articleHeight - window.innerHeight)) * 100));
                    bar.style.width = progress + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // TOC Active Link Tracking
    // ===================================

    function initTOC() {
        var tocLinks = document.querySelectorAll('.article-toc-list a');
        var headings = [];

        tocLinks.forEach(function (link) {
            var targetId = link.getAttribute('href');
            if (targetId && targetId.charAt(0) === '#') {
                var heading = document.getElementById(targetId.substring(1));
                if (heading) headings.push({ el: heading, link: link });
            }
        });

        if (headings.length === 0) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    tocLinks.forEach(function (l) { l.classList.remove('active'); });
                    for (var i = 0; i < headings.length; i++) {
                        if (headings[i].el === entry.target) {
                            headings[i].link.classList.add('active');
                            break;
                        }
                    }
                }
            });
        }, {
            rootMargin: '-80px 0px -70% 0px',
            threshold: 0
        });

        headings.forEach(function (h) { observer.observe(h.el); });
    }

    // ===================================
    // Section Visibility Tracking
    // ===================================

    function initSectionTracking() {
        var sections = document.querySelectorAll('[data-section]');
        if (sections.length === 0) return;

        var tracked = {};

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var sectionName = entry.target.getAttribute('data-section');
                    var sectionPos = entry.target.getAttribute('data-position') || '';

                    if (!tracked[sectionName]) {
                        tracked[sectionName] = true;

                        pushDataLayer('section_view', {
                            section_name: sectionName,
                            section_position: sectionPos,
                            page_type: 'blog_article'
                        });
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(function (s) { observer.observe(s); });
    }

    // ===================================
    // Scroll Depth Tracking
    // ===================================

    function initScrollDepth() {
        var milestones = [25, 50, 75, 90];
        var reached = {};

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    var scrollPercent = Math.round((window.scrollY / docHeight) * 100);

                    milestones.forEach(function (m) {
                        if (scrollPercent >= m && !reached[m]) {
                            reached[m] = true;
                            pushDataLayer('scroll_depth', {
                                scroll_percent: m,
                                page_type: 'blog_article'
                            });
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // Sticky CTA Bar
    // ===================================

    function initStickyCTA() {
        var stickyCta = document.querySelector('.sticky-cta');
        var ctaSection = document.querySelector('.article-cta-section');
        if (!stickyCta) return;

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    var windowH = window.innerHeight;

                    var showAfter = 800;
                    var formTop = ctaSection ? ctaSection.offsetTop : Infinity;

                    if (scrollY > showAfter && (scrollY + windowH) < formTop) {
                        stickyCta.classList.add('show');
                    } else {
                        stickyCta.classList.remove('show');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // Form Handling
    // ===================================

    function initForm() {
        var form = document.getElementById('blogLeadForm');
        if (!form) return;

        // Populate hidden UTM fields
        var utmParams = getUTMParams();
        Object.keys(utmParams).forEach(function (key) {
            var input = form.querySelector('[name="' + key + '"]');
            if (input) input.value = utmParams[key];
        });

        // Set fbc/fbp
        var fbcInput = form.querySelector('[name="fbc"]');
        var fbpInput = form.querySelector('[name="fbp"]');
        if (fbcInput) fbcInput.value = getCookie('_fbc') || '';
        if (fbpInput) fbpInput.value = getCookie('_fbp') || '';

        // Form start tracking
        var formStarted = false;
        form.querySelectorAll('input:not([type=hidden])').forEach(function (input) {
            input.addEventListener('focus', function () {
                if (!formStarted) {
                    formStarted = true;
                    pushDataLayer('form_start', {
                        form_name: 'blog_lead',
                        field: input.name
                    });
                }
            }, { once: true });
        });

        // Submit
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot check
            var hp = form.querySelector('[name="company_fax"]');
            if (hp && hp.value) return;

            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Надсилаємо...';
            }

            var formData = new FormData(form);
            var email = formData.get('email') || '';
            var phone = formData.get('phone') || '';
            var website = formData.get('website') || '';

            // DataLayer
            var leadEventId = generateEventId();
            pushDataLayer('form_submit', {
                form_name: 'blog_lead',
                email: email,
                fb_event_id: leadEventId
            });
            pushDataLayer('capi_lead', { fb_event_id: leadEventId });

            // CAPI Lead event
            hashSHA256(email).then(function (hashedEmail) {
                return hashSHA256(phone).then(function (hashedPhone) {
                    sendCAPI('Lead', {
                        em: hashedEmail,
                        ph: hashedPhone,
                        fbp: getCookie('_fbp'),
                        fbc: getCookie('_fbc')
                    }, {
                        content_name: document.title,
                        content_category: 'blog',
                        value: 0,
                        currency: 'EUR'
                    });
                });
            });

            // Send to Make.com
            var jsonData = {};
            formData.forEach(function (value, key) {
                jsonData[key] = value;
            });
            jsonData.page_url = window.location.href;
            jsonData.page_title = document.title;

            fetch(FORM_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            }).then(function (resp) {
                if (resp.ok) {
                    // Redirect to thank-you page
                    window.location.href = '/product-report-thank-you-2026.html?source=blog&email=' + encodeURIComponent(email);
                } else {
                    throw new Error('Submit failed');
                }
            }).catch(function () {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Спробувати ще раз';
                }
            });
        });
    }

    // ===================================
    // CTA Click Tracking
    // ===================================

    function initCTATracking() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('.cta-inline, .sticky-cta-btn, .article-cta-section button');
            if (!link) return;

            var location = 'unknown';
            if (link.classList.contains('cta-inline')) location = 'inline_cta';
            else if (link.classList.contains('sticky-cta-btn')) location = 'sticky_cta';
            else location = 'final_cta';

            pushDataLayer('cta_click', {
                cta_location: location,
                page_type: 'blog_article',
                cta_text: link.textContent.trim().substring(0, 50)
            });
        });
    }

    // ===================================
    // Time on Page Tracking
    // ===================================

    function initTimeTracking() {
        var intervals = [30, 60, 120, 300]; // seconds
        var tracked = {};

        intervals.forEach(function (sec) {
            setTimeout(function () {
                if (!document.hidden) {
                    tracked[sec] = true;
                    pushDataLayer('time_on_page', {
                        seconds: sec,
                        page_type: 'blog_article'
                    });
                }
            }, sec * 1000);
        });
    }

    // ===================================
    // Init All
    // ===================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initPageView();
        initReadingProgress();
        initTOC();
        initSectionTracking();
        initScrollDepth();
        initStickyCTA();
        initForm();
        initCTATracking();
        initTimeTracking();
    }

    init();
})();
