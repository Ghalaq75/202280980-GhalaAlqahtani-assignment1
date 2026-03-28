# 202280980-GhalaAlqahtani-assignment2

A responsive personal portfolio website built on top of Assignment 1, now upgraded with interactive features, live data from a public API, and improved user experience.

## 👩‍💻 About

I'm Ghala Alqahtani, a Software Engineering student at KFUPM. This portfolio showcases my journey in software development, AI research, and system design.

## 🌟 New Features (Assignment 2)

| Feature | Description |
|---|---|
| **Live Project Search** | Real-time search bar that filters project cards as you type, with text highlighting and an empty-state message |
| **API Quotes** | Fetches an inspirational tech/learning quote from the Quotable.io public API each time the page loads; includes loading animation, error fallback, and a "New Quote" button |
| **Improved Form Validation** | Per-field inline error messages with shake animation; fields re-validate on blur and clear errors as you correct them |
| **localStorage Theme** | Dark/light mode preference is saved and restored across sessions |

## ✅ Assignment 2 Requirements Met

- **Dynamic Content** — Live search filters projects based on user input (typing)
- **Data Handling** — Fetches data from a public API (quotable.io) with loading state, error handling, and fallback content
- **Animation & Transitions** — Loading dots, fade-in cards, shake on invalid fields, highlight on matched text
- **Error Handling & Feedback** — Per-field validation errors, API error fallback, empty-state message, result count label

## 🛠️ Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, CSS Variables, Animations)
- Vanilla JavaScript (Fetch API, IntersectionObserver, localStorage)
- [Quotable.io](https://github.com/lukePeavey/quotable) – free public quotes API

## 📁 Project Structure

```
assignment-2/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for the API quote feature)
- (Optional) A local server for development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/202280980-GhalaAlqahtani-assignment2.git
```

2. Navigate to the project directory:
```bash
cd 202280980-GhalaAlqahtani-assignment2
```

3. Open `index.html` in your browser:
   - **Option 1**: Double-click the `index.html` file
   - **Option 2**: Use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js
     npx http-server
     ```
   - Then navigate to `http://localhost:8000`

> **Note**: The API quote feature requires an internet connection. If the API is unavailable, a fallback quote is shown automatically.

## 📱 Responsive Breakpoints

| Breakpoint | Width |
|---|---|
| Desktop | 1200px and above |
| Tablet | 768px – 1199px |
| Mobile | 480px – 767px |
| Small Mobile | Below 480px |

## 🤖 AI Integration

This project was developed with assistance from Claude (Anthropic). For detailed information see [docs/ai-usage-report.md](docs/ai-usage-report.md).

## 📝 Features Breakdown

### 1. Live Project Search
- Located above the projects grid
- Filters cards in real-time as the user types
- Searches across project title, description, and technology tags
- Highlights matched text within card titles
- Shows a result count ("Showing 2 of 4 projects")
- Displays an empty-state message with a helpful tip when no results found
- Clear (✕) button appears when the field has text

### 2. API Quotes (Quotable.io)
- Displayed in the Hero section as a styled quote card
- Shows animated loading dots while fetching
- Displays the quote and author on success
- Falls back to a local list of quotes on network/API error
- "New Quote" button fetches a fresh quote on demand
- "Try again" button appears if the initial fetch fails

### 3. Improved Form Validation
- Inline error messages appear below each field on blur
- Fields turn red with a shake animation when invalid
- Errors clear automatically as the user corrects input
- Submit button is disabled during submission to prevent duplicates
- Success message auto-hides after 5 seconds

### 4. Theme Toggle (from Assignment 1, improved)
- Persisted in `localStorage`
- Respects system `prefers-color-scheme` as the initial default

## 🎨 Design Choices

The Como theme is preserved from Assignment 1:
- **Light Mode**: Soft greens and natural tones (`#f5f7f4`, `#7a9b7f`)
- **Dark Mode**: Deep forest greens with sage accents (`#1a2420`, `#91b396`)
- **New additions**: Error red (`#c0392b`), highlight green overlay, quote card border accent

## 🌐 Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari, Chrome Mobile

## 👤 Author

**Ghala Alqahtani**  
Student ID: 202280980

---

## 🔗 Useful Links

- [AI Usage Report](docs/ai-usage-report.md)
- [Technical Documentation](docs/technical-documentation.md)

## 📮 Contact

Use the contact form on the website or reach out via email.
