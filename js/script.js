// ================================
// Theme Toggle Functionality
// ================================

/**
 * Initialize theme based on user preference or system preference
 */
function initializeTheme() {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Check system preference
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
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ================================
// Time-Based Greeting
// ================================

/**
 * Display greeting based on current time of day
 */
function setGreeting() {
    const greetingElement = document.getElementById('greeting');
    const currentHour = new Date().getHours();
    
    let greeting;
    
    if (currentHour < 12) {
        greeting = 'Good Morning! ☀️';
    } else if (currentHour < 18) {
        greeting = 'Good Afternoon! 🌤️';
    } else {
        greeting = 'Good Evening! 🌙';
    }
    
    greetingElement.textContent = greeting;
}

// ================================
// Smooth Scrolling Enhancement
// ================================

/**
 * Add smooth scrolling behavior to navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Form Handling
// ================================

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate form (basic validation, already handled by HTML5 'required' attribute)
    if (name && email && message) {
        // Show success message
        const successMessage = document.getElementById('formSuccess');
        successMessage.classList.add('show');
        
        // Log form data (in a real application, this would be sent to a server)
        console.log('Form Submitted:', { name, email, message });
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
}

// ================================
// Active Navigation Highlight
// ================================

/**
 * Highlight active section in navigation based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Offset for navbar
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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
 * Add fade-in animation to elements when they come into view
 */
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ================================
// Initialization
// ================================

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Set time-based greeting
    setGreeting();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize scroll animations
    observeElements();
    
    // Add theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add form submit event listener
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add scroll event listener for active nav highlighting
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update active nav on page load
    updateActiveNavLink();
});



function addHoverSounds() {
    const buttons = document.querySelectorAll('button, .project-card');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Add subtle hover feedback
            button.style.transition = 'all 0.3s ease';
        });
    });
}


/**
 * Console welcome message for developers
 */
console.log('%c👋 Hello Developer!', 'color: #9b8b7e; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to Ghala\'s portfolio!', 'color: #5a5a5a; font-size: 14px;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #8a8a8a; font-size: 12px;');
