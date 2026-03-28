# AI Usage Report – Assignment 2

**Student:** Ghala Alqahtani  
**Student ID:** 202280980  
**Assignment:** Assignment 2 – Interactive Features  
**Date:** 2026

---

## Overview

This document describes how AI tools were used during the development of Assignment 2. All AI-generated content was reviewed, understood, and modified before being included in the project.

---

## AI Tool Used

| Tool | Version | Purpose |
|---|---|---|
| Claude (Anthropic) | Claude Sonnet | Code generation, debugging, documentation |

---

## How AI Was Used

### 1. Live Project Search Feature

**What I asked:** I asked Claude to help me design a live search function that filters project cards as the user types, searches across title, description, and technology tags, and highlights matched text.

**What AI generated:** A `filterProjects()` function using `querySelector`, `classList.add/remove('hidden')`, and a `highlightText()` helper that uses a regex to wrap matched substrings in a `<mark>` element.

**What I changed:**
- Added the `data-title` and `data-tags` attributes to the HTML cards myself, based on my actual project information.
- Added the result count label ("Showing X of Y projects") as an extra touch not in the original suggestion.
- Adjusted the empty-state message text to match my portfolio's tone.

**What I learned:** How `IntersectionObserver` and CSS class toggling can replace heavier jQuery DOM manipulation, and how to use `RegExp` safely with user input by escaping special characters via `escapeRegex()`.

---

### 2. API Quotes Feature

**What I asked:** I asked Claude to show me how to fetch data from a free, CORS-enabled public API and display it with a loading state, error handling, and a fallback.

**What AI generated:** An `async fetchQuote()` function using the `Fetch API` with `AbortSignal.timeout()` for a timeout, a try/catch block for error handling, and DOM updates to show loading dots, quote content, or error state.

**What I changed:**
- Chose the specific API endpoint tag filter (`technology|success|learning|knowledge|science`) to make quotes relevant to a tech portfolio.
- Wrote the fallback quotes list myself, selecting quotes I personally find meaningful.
- Added the "New Quote ↻" button and wired it to call `fetchQuote()` again — this was my own addition.
- Styled the quote box with a left border accent and loading dot animation in CSS, which I designed based on the existing Como theme.

**What I learned:** How to use `AbortSignal.timeout()` to prevent hanging requests, and why CORS matters when choosing a public API (some APIs require a proxy server).

---

### 3. Improved Form Validation

**What I asked:** I asked Claude to improve the existing form to show per-field inline error messages with animations instead of relying only on the browser's built-in HTML5 validation.

**What AI generated:** A `validateField()` function that checks for empty fields and valid email format, toggling an `.invalid` CSS class and populating a `<span class="field-error">` element.

**What I changed:**
- Added the `blur` event so errors only show after the user leaves a field (less aggressive UX).
- Added the `input` event to clear errors as the user corrects them.
- Wrote the shake `@keyframes` animation myself to give invalid fields a physical feedback feel.
- Disabled the submit button during the simulated send delay — I added this myself to prevent double submissions.

**What I learned:** The difference between `required` HTML validation and custom JavaScript validation, and why progressive disclosure of errors (on blur rather than immediately) is better UX.

---

### 4. Documentation

**What I asked:** I asked Claude to review my README structure and suggest improvements for clarity.

**What AI generated:** A table-based features summary and a structured "Requirements Met" section.

**What I changed:**
- Rewrote all feature descriptions in my own words to reflect what I actually built.
- Added the API fallback note under "Getting Started" myself.
- Wrote the AI Usage Report (this document) entirely myself, only using Claude to check grammar.

---

## Reflection

Using AI tools significantly accelerated the development process, especially for boilerplate code like the Fetch API pattern and regex escaping. However, I had to understand the generated code deeply before I could integrate it correctly — for example, I needed to understand how `AbortSignal.timeout()` works and why I needed `escapeRegex()` before the `filterProjects()` function was safe to use.

The most valuable learning came from adapting the AI output to my specific context: choosing the right API, writing my own fallback quotes, and deciding how validation errors should behave. AI helped me move faster, but the decisions about what to build and why were always mine.

---

## Academic Integrity Statement

All AI-generated code was reviewed, understood, and modified. No AI output was submitted unmodified. This report transparently documents every instance of AI assistance in this assignment.
