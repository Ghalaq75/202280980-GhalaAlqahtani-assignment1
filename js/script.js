// ================================
// Theme Toggle Functionality
// ================================

/**
 * Initialize theme based on saved preference or system preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Update the theme toggle button icon
 * @param {string} theme - 'light' or 'dark'
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ================================
// Time-Based Greeting
// ================================

/**
 * Display a greeting based on the current hour
 */
function setGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) {
        greeting = 'Good Morning! ☀️';
    } else if (hour < 18) {
        greeting = 'Good Afternoon! 🌤️';
    } else {
        greeting = 'Good Evening! 🌙';
    }

    greetingElement.textContent = greeting;
}

// ================================
// API Quote Feature
// ================================

/**
 * Fetch an inspirational quote from a public API and display it.
 * Uses the ZenQuotes API proxy to avoid CORS issues.
 * Falls back to a hardcoded quote list if the API is unavailable.
 */
async function fetchQuote() {
    const loadingEl = document.getElementById('quoteLoading');
    const contentEl = document.getElementById('quoteContent');
    const errorEl   = document.getElementById('quoteError');
    const textEl    = document.getElementById('quoteText');
    const authorEl  = document.getElementById('quoteAuthor');
    const newBtn    = document.getElementById('newQuoteBtn');

    // Show loading, hide others
    loadingEl.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display   = 'none';
    if (newBtn) newBtn.style.display = 'none';

    try {
        // Using Quotable.io API – free, CORS-enabled, no key required
        // Tags chosen for general life & inspiration (no coding topics)
        const response = await fetch('https://api.quotable.io/random?tags=inspirational|life|wisdom|motivational|happiness|friendship|nature', {
            signal: AbortSignal.timeout(6000)  // 6 second timeout
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();

        textEl.textContent   = data.content;
        authorEl.textContent = `— ${data.author}`;

        // Reveal quote
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        if (newBtn) newBtn.style.display = 'flex';

    } catch (err) {
        console.warn('Quote API failed, using fallback:', err.message);

        // Fallback: rotate through a local list so there is always content
        const fallbackQuotes = [
            { content: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
            { content: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
            { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
            { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
            { content: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
            { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
            { content: "Believe you can and you are halfway there.", author: "Theodore Roosevelt" },
        ];

        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        const fallback = fallbackQuotes[randomIndex];

        textEl.textContent   = fallback.content;
        authorEl.textContent = `— ${fallback.author}`;

        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        if (newBtn) newBtn.style.display = 'flex';
    }
}

// ================================
// Live Project Search
// ================================

/**
 * Filter project cards based on a search query.
 * Matches against the card's title, tag text, and description.
 * Highlights matched text within card titles.
 * Shows an empty state message when nothing matches.
 *
 * @param {string} query - The text to search for
 */
function filterProjects(query) {
    const cards      = document.querySelectorAll('.project-card');
    const emptyState = document.getElementById('emptyState');
    const countEl    = document.getElementById('searchCount');
    const clearBtn   = document.getElementById('clearSearch');

    const trimmed = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        // Get searchable text from data attributes + card content
        const title       = card.getAttribute('data-title') || '';
        const tags        = card.getAttribute('data-tags') || '';
        const description = card.querySelector('p') ? card.querySelector('p').textContent : '';
        const combined    = `${title} ${tags} ${description}`.toLowerCase();

        if (trimmed === '' || combined.includes(trimmed)) {
            card.classList.remove('hidden');
            visibleCount++;

            // Restore / update title highlight
            const h3 = card.querySelector('h3');
            if (h3) {
                if (trimmed === '') {
                    h3.textContent = title;
                } else {
                    h3.innerHTML = highlightText(title, trimmed);
                }
            }
        } else {
            card.classList.add('hidden');

            // Remove any leftover highlight
            const h3 = card.querySelector('h3');
            if (h3) h3.textContent = title;
        }
    });

    // Show / hide clear button
    if (clearBtn) clearBtn.style.display = trimmed ? 'inline-block' : 'none';

    // Show / hide empty state
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';

    // Result count label
    if (countEl) {
        if (trimmed === '') {
            countEl.textContent = '';
        } else if (visibleCount === 0) {
            countEl.textContent = 'No projects matched your search.';
        } else {
            countEl.textContent = `Showing ${visibleCount} of ${cards.length} project${cards.length !== 1 ? 's' : ''}`;
        }
    }
}

/**
 * Wrap matched substring with a <mark> highlight span.
 * @param {string} text    - Original text
 * @param {string} query   - Lowercase search query
 * @returns {string} HTML string with highlights
 */
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}

/**
 * Escape special regex characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Set up all event listeners for the search input.
 */
function initializeSearch() {
    const searchInput = document.getElementById('projectSearch');
    const clearBtn    = document.getElementById('clearSearch');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        filterProjects(this.value);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            filterProjects('');
            searchInput.focus();
        });
    }
}

// ================================
// Smooth Scrolling
// ================================

/**
 * Add smooth scrolling behaviour to all internal anchor links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId      = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight   = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ================================
// Form Validation & Handling
// ================================

/**
 * Validate a single field and show / clear error messages.
 * @param {HTMLElement} field - The input or textarea element
 * @returns {boolean} true if field is valid
 */
function validateField(field) {
    const errorEl = document.getElementById(`${field.id}Error`);
    let errorMsg  = '';

    if (field.value.trim() === '') {
        errorMsg = `${capitalize(field.name)} is required.`;
    } else if (field.type === 'email' && !isValidEmail(field.value.trim())) {
        errorMsg = 'Please enter a valid email address.';
    }

    if (errorEl) errorEl.textContent = errorMsg;

    if (errorMsg) {
        field.classList.add('invalid');
        return false;
    } else {
        field.classList.remove('invalid');
        return true;
    }
}

/**
 * Basic email format check
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Capitalise first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Handle contact form submission with validation
 * @param {Event} e
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const nameField    = document.getElementById('name');
    const emailField   = document.getElementById('email');
    const messageField = document.getElementById('message');
    const submitBtn    = document.querySelector('.submit-btn');

    const nameValid    = validateField(nameField);
    const emailValid   = validateField(emailField);
    const messageValid = validateField(messageField);

    if (!nameValid || !emailValid || !messageValid) return;

    // Simulate sending (disable button to prevent double-submit)
    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending…';

    setTimeout(() => {
        const successMessage = document.getElementById('formSuccess');
        successMessage.classList.add('show');

        // Log for demo purposes
        console.log('Form submitted:', {
            name:    nameField.value,
            email:   emailField.value,
            message: messageField.value,
        });

        document.getElementById('contactForm').reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }, 800); // small delay to mimic network request
}

// ================================
// Active Navigation Highlight
// ================================

/**
 * Highlight the nav link matching the current visible section
 */
function updateActiveNavLink() {
    const sections    = document.querySelectorAll('section[id]');
    const navLinks    = document.querySelectorAll('.nav-links a');
    const scrollPos   = window.scrollY + 100;
    let currentSection = '';

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ================================
// Scroll Animations
// ================================

/**
 * Fade-in project cards when they scroll into view
 */
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ================================
// Initialization
// ================================

/**
 * Boot all features once the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function () {
    // Theme
    initializeTheme();
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Greeting
    setGreeting();

    // Quote
    fetchQuote();
    document.getElementById('newQuoteBtn')?.addEventListener('click', fetchQuote);
    document.getElementById('retryQuote')?.addEventListener('click', fetchQuote);

    // Live search
    initializeSearch();

    // Smooth scrolling
    initializeSmoothScrolling();

    // Scroll animations
    observeElements();

    // Form
    document.getElementById('contactForm')?.addEventListener('submit', handleFormSubmit);

    // Live field validation on blur
    ['name', 'email', 'message'].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.addEventListener('blur', () => validateField(field));
        // Clear invalid state on input once user starts correcting
        if (field) field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) validateField(field);
        });
    });

    // Active nav on scroll
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();
});

// ================================
// Developer Console Message
// ================================
console.log('%c👋 Hello Developer!', 'color: #9b8b7e; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to Ghala\'s portfolio – Assignment 2', 'color: #5a5a5a; font-size: 14px;');
console.log('%cFeatures: Live Search | API Quotes | Dark Mode | Animated Cards', 'color: #8a8a8a; font-size: 12px;');
