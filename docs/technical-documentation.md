# Technical Documentation

## Project Overview

This document provides detailed technical information about the portfolio website implementation, including architecture decisions, code explanations, and development notes.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [HTML Structure](#html-structure)
3. [CSS Implementation](#css-implementation)
4. [JavaScript Functionality](#javascript-functionality)
5. [Responsive Design Strategy](#responsive-design-strategy)
6. [Performance Considerations](#performance-considerations)
7. [Browser Compatibility](#browser-compatibility)
8. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### Technology Stack

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern styling with variables, Grid, Flexbox, and keyframe animations
- **Vanilla JavaScript**: No dependencies, pure ES6+ JavaScript
- **Local Storage API**: For theme preference persistence
- **Fetch API**: For retrieving quotes from a public REST API
- **Quotable.io API**: Free, CORS-enabled public API for inspirational quotes

### Design Pattern

The project follows a simple, modular structure:
- Separation of concerns (HTML/CSS/JS in separate files)
- Component-based CSS organization
- Event-driven JavaScript architecture
- Progressive enhancement approach
- Graceful degradation for network failures (API fallback)

---

## HTML Structure

### Semantic Elements

The HTML uses semantic elements for better accessibility and SEO:

```html
<nav>     - Navigation container
<section> - Content sections
<article> - Self-contained content (project cards)
<header>  - Introductory content
<footer>  - Footer information
```

### Document Structure

```
<!DOCTYPE html>
└── <html lang="en">
    ├── <head>
    │   ├── Meta tags (charset, viewport)
    │   ├── Title
    │   └── Stylesheet link
    └── <body>
        ├── <nav> - Navigation bar
        ├── <section class="hero">
        │   └── .quote-box - API quote display
        ├── <section id="about"> - About section
        ├── <section id="projects">
        │   ├── .search-wrapper - Live search bar
        │   ├── .projects-grid  - Project cards
        │   └── .empty-state    - No results message
        ├── <section id="contact"> - Contact section
        └── <footer> - Footer
```

### Data Attributes on Project Cards

Each project card carries `data-*` attributes used by the live search feature:

```html
<article
  class="project-card"
  data-title="Distributed Storage System"
  data-tags="java socket programming multi-threading distributed storage"
>
```

- `data-title` — the project name (also used for text highlighting)
- `data-tags` — space-separated keywords matching the technology tags shown on the card

### Accessibility Features

1. **ARIA Labels**: Used on interactive elements
   ```html
   <button aria-label="Toggle theme">
   <input aria-label="Search projects">
   ```

2. **Semantic Forms**: Proper labels and input associations
   ```html
   <label for="name">Name</label>
   <input type="text" id="name" name="name">
   ```

3. **`novalidate` on form**: Disables browser default popups so custom inline errors are shown instead

---

## CSS Implementation

### CSS Architecture

#### 1. CSS Variables (Custom Properties)

CSS variables enable easy theming and maintenance:

```css
:root {
    --bg-primary: #f5f7f4;
    --accent-color: #7a9b7f;
    --error-color: #c0392b;
    --error-bg: #fdf0ef;
}

[data-theme="dark"] {
    --bg-primary: #1a2420;
    --accent-color: #91b396;
    --error-color: #e57373;
    --error-bg: #3a2020;
}
```

**Benefits**:
- Single source of truth for colors
- Easy theme switching
- Error states automatically adapt to light/dark mode

#### 2. Layout Systems

**CSS Grid** — Used for:
- About section (image + text layout)
- Projects grid (responsive card layout)

```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-md);
}
```

**Flexbox** — Used for:
- Navigation bar
- Search bar (icon + input + clear button)
- Quote box (loading dots + content)
- Tag groups

#### 3. Responsive Design

**Breakpoints**:
- 480px: Small mobile
- 768px: Tablet
- 1200px: Desktop

### Animation & Transitions

#### Keyframe Animations

```css
/* Hero / section entrance */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* API quote loading indicator */
@keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40%           { transform: translateY(-8px); opacity: 1; }
}

/* Invalid form field feedback */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
}
```

#### Transitions

```css
.project-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

.project-card:hover {
    transform: translateY(-8px);
}
```

### New CSS Components (Assignment 2)

#### Quote Box

```css
.quote-box {
    border-left: 4px solid var(--accent-color);
    border-radius: 0 12px 12px 0;
    padding: var(--spacing-md);
    box-shadow: 0 4px 20px var(--shadow);
}
```

Three inner states are toggled by JavaScript: `.quote-loading`, `.quote-content`, `.quote-error`.

#### Search Bar

```css
.search-bar {
    display: flex;
    align-items: center;
    border: 2px solid var(--bg-accent);
    border-radius: 30px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar:focus-within {
    border-color: var(--accent-color);
    box-shadow: 0 4px 16px var(--shadow-hover);
}
```

#### Highlighted Search Match

```css
.highlight {
    background-color: rgba(122, 155, 127, 0.3);
    border-radius: 2px;
    padding: 0 2px;
}
```

#### Field Error State

```css
.form-group input.invalid {
    border-color: var(--error-color);
    background-color: var(--error-bg);
    animation: shake 0.35s ease;
}

.field-error {
    display: block;
    font-size: 0.85rem;
    color: var(--error-color);
}
```

---

## JavaScript Functionality

### Core Features

#### 1. Theme Toggle System

**Implementation**:
```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}
```

**Flow**:
1. User clicks theme toggle button
2. JavaScript reads current theme from `data-theme` attribute
3. Switches to the opposite theme
4. Saves preference to `localStorage`
5. Updates CSS variables via the data attribute change
6. Changes the button icon (🌙 / ☀️)

---

#### 2. Time-Based Greeting

```javascript
function setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12)       greeting = 'Good Morning! ☀️';
    else if (hour < 18)  greeting = 'Good Afternoon! 🌤️';
    else                 greeting = 'Good Evening! 🌙';
    greetingElement.textContent = greeting;
}
```

**Time Ranges**: 0–11 → Morning | 12–17 → Afternoon | 18–23 → Evening

---

#### 3. API Quote Feature *(Assignment 2)*

**Implementation**:
```javascript
async function fetchQuote() {
    // Show loading state
    loadingEl.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display   = 'none';

    try {
        const response = await fetch(
            'https://api.quotable.io/random?tags=technology|success|learning',
            { signal: AbortSignal.timeout(6000) }
        );
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        textEl.textContent   = data.content;
        authorEl.textContent = `— ${data.author}`;

        // Reveal quote content
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        newBtn.style.display    = 'flex';

    } catch (err) {
        // Fall back to local quote list — page never breaks
        const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        textEl.textContent   = fallback.content;
        authorEl.textContent = `— ${fallback.author}`;
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    }
}
```

**Key decisions**:
- `AbortSignal.timeout(6000)` — cancels the request after 6 seconds to prevent the UI hanging
- Tag filter (`technology|success|learning|knowledge|science`) keeps quotes relevant to a tech portfolio
- Fallback array of 7 curated quotes ensures content is always shown, even offline
- "New Quote ↻" button calls `fetchQuote()` again on demand

**API**: [Quotable.io](https://github.com/lukePeavey/quotable) — free, no API key required, CORS-enabled

**Loading states managed**:

| State | Elements shown |
|---|---|
| Fetching | `.quote-loading` (animated dots) |
| Success | `.quote-content` + New Quote button |
| Error / timeout | Fallback quote shown in `.quote-content` |

---

#### 4. Live Project Search *(Assignment 2)*

**Implementation**:
```javascript
function filterProjects(query) {
    const trimmed = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        const combined = `${card.dataset.title} ${card.dataset.tags}
                          ${card.querySelector('p').textContent}`.toLowerCase();

        if (trimmed === '' || combined.includes(trimmed)) {
            card.classList.remove('hidden');
            visibleCount++;
            // Highlight matched text in title
            h3.innerHTML = trimmed ? highlightText(title, trimmed) : title;
        } else {
            card.classList.add('hidden');
            h3.textContent = title; // restore plain text
        }
    });

    // Update result count label and empty state
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    countEl.textContent = trimmed
        ? `Showing ${visibleCount} of ${cards.length} projects`
        : '';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
}
```

**Search scope**: project title + technology tags (`data-tags`) + card description paragraph

**UX details**:
- Result count label updates with every keystroke
- Clear (✕) button appears when the field has text
- Empty-state message includes a tip ("Try 'Java', 'AI', or 'UML'")
- `escapeRegex()` prevents crashes when the user types regex special characters

---

#### 5. Improved Form Validation *(Assignment 2)*

**Implementation**:
```javascript
function validateField(field) {
    let errorMsg = '';
    if (field.value.trim() === '') {
        errorMsg = `${capitalize(field.name)} is required.`;
    } else if (field.type === 'email' && !isValidEmail(field.value.trim())) {
        errorMsg = 'Please enter a valid email address.';
    }

    errorEl.textContent = errorMsg;
    field.classList.toggle('invalid', !!errorMsg);
    return !errorMsg;
}
```

**Validation behaviour**:
- Errors appear **on blur** (when the user leaves a field) — not on every keystroke
- Errors **clear progressively** as the user corrects input (`input` event)
- Submit button is **disabled** during the simulated send delay to prevent double submission
- `novalidate` on the `<form>` disables browser default popups so custom messages are always shown

---

#### 6. Smooth Scrolling

```javascript
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target   = document.querySelector(this.getAttribute('href'));
            const offset   = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    });
}
```

---

#### 7. Intersection Observer (Scroll Animations)

```javascript
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
```

### Event Flow

```
Page Load
    ├── initializeTheme()        — restore saved or system theme
    ├── setGreeting()            — time-based hero greeting
    ├── fetchQuote()             — load API quote with loading state
    ├── initializeSearch()       — attach input + clear listeners
    ├── initializeSmoothScrolling()
    ├── observeElements()        — fade-in project cards on scroll
    └── attach form listeners    — submit, blur, input events

User Interactions
    ├── Click theme button    → toggleTheme()
    ├── Click nav link        → smooth scroll to section
    ├── Type in search bar    → filterProjects() on every keystroke
    ├── Click clear (✕)       → reset search, refocus input
    ├── Click "New Quote"     → fetchQuote() again
    ├── Blur form field       → validateField()
    ├── Type in invalid field → validateField() (progressive clear)
    ├── Submit form           → validateField() all fields → show success
    └── Scroll page           → IntersectionObserver animates cards
```

---

## Responsive Design Strategy

### Breakpoint System

```css
/* Base styles (desktop) */
.element { /* desktop styles */ }

/* Tablet: 768px and below */
@media (max-width: 768px) { }

/* Mobile: 480px and below */
@media (max-width: 480px) { }
```

### Responsive Patterns

#### Fluid Project Grid
```css
.projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

#### Search Bar
The search bar uses `flex: 1` on the input so it fills available space at any viewport width. On mobile it spans full width naturally.

#### Quote Box
Uses `max-width: 620px` with `margin: auto` — centres on desktop, fills width on mobile.

---

## Performance Considerations

### Optimization Techniques

1. **CSS transforms & opacity** for animations — GPU-accelerated, no layout reflow
2. **IntersectionObserver** instead of scroll listeners — fires only when needed
3. **`AbortSignal.timeout()`** on fetch — prevents long-hanging network requests
4. **Passive scroll listener** — `{ passive: true }` on the scroll event for active nav highlighting
5. **No external libraries** — zero dependency overhead
6. **localStorage** for theme — avoids flash of wrong theme on reload

---

## Browser Compatibility

### Supported Browsers

- **Chrome / Edge**: Full support (latest)
- **Firefox**: Full support (latest)
- **Safari**: Full support (latest)
- **Mobile Safari**: Full support (iOS 14+)
- **Chrome Mobile**: Full support

### Feature Support

| Feature | Chrome | Firefox | Safari | Mobile |
|---|---|---|---|---|
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ | ✅ |
| AbortSignal.timeout() | ✅ | ✅ | ✅ (16.4+) | ✅ |
| CSS `@keyframes` | ✅ | ✅ | ✅ | ✅ |

### Fallbacks

- **API unavailable**: A local fallback array of 7 quotes is shown automatically — no broken UI
- **CSS Variables**: Solid color fallbacks declared before variable declarations for older browsers

---

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - Connect contact form to a real email service (e.g. EmailJS, Formspree)
   - Server-side form validation

2. **Additional Sections**
   - Skills section with animated progress bars
   - Timeline / experience section
   - Blog / articles section

3. **Enhanced Interactivity**
   - Image lightbox for project screenshots
   - Typing animation for the hero tagline
   - Project category filter buttons (in addition to live search)

4. **Performance**
   - Lazy loading for project images
   - Service worker for offline support

5. **Accessibility**
   - Keyboard navigation for search results
   - `prefers-reduced-motion` support to disable animations
   - Screen reader announcements for dynamic content changes (live search count)

---

## Development Notes

### Coding Standards

1. **Indentation**: 4 spaces
2. **Naming**: kebab-case for CSS, camelCase for JS
3. **Comments**: Section headers and explanatory comments throughout
4. **Organization**: Logical grouping of related code

### Testing Checklist

- [x] Cross-browser testing
- [x] Mobile responsiveness
- [x] Form validation (inline errors, shake animation)
- [x] Theme toggle persistence (localStorage)
- [x] Smooth scrolling
- [x] Live search — filters, highlights, empty state, result count
- [x] API quote — loading state, success display, error fallback
- [x] New Quote button
- [x] All links functional
- [x] No console errors
- [x] Accessibility check

---

## Conclusion

This portfolio website demonstrates modern web development practices with clean, maintainable code. Assignment 2 extended the foundation with interactive features — live search, API data fetching, and improved form validation — while keeping the codebase dependency-free and fully responsive.

---

**Document Version**: 2.0
**Last Updated**: March 2026
**Author**: Ghala Alqahtani (202280980)
