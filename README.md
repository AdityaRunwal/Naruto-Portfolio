# Aditya Runwal | AI/ML Shinobi Portfolio

A professional, high-performance personal portfolio built for an **Aspiring AI/ML Engineer**. Features a sleek dark theme with vibrant orange accents (`#ff7b00`), subtle Naruto-inspired engineering motifs ("Missions", Jutsu skill tiers, S-Rank/A-Rank badges), and responsive layouts.

---

## 🎯 Purpose & Focus

This portfolio showcases technical expertise, hardware-software projects, and machine learning models for **Aditya Runwal**. 

- **Primary Role**: Aspiring AI & Machine Learning Engineer
- **Core Domains**: Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, Exploratory Data Analysis (EDA), and IoT Systems.
- **Design Philosophy**: 70% Professional Engineering Focus / 30% Subtle Naruto-Inspired Visual Elements.

---

## ✨ Features

- ⚡ **Interactive Mission Showcase**: Project cards categorized by rank (*S-Rank*, *A-Rank*) with interactive filter tabs (*All Missions*, *AI & IoT*, *ML & EDA*, *Deep Learning*).
- 📱 **Fully Responsive Layout**: Built with CSS Grid and Flexbox for seamless viewing on desktops, tablets, and mobile devices.
- 🎯 **Active Scrollspy Navigation**: Automatically highlights active menu links and closes the mobile drawer upon selection.
- 🎨 **Glassmorphism & Theme Aesthetics**: Dark background (`#0d0d0d`) with frosted glass navbar blur (`backdrop-filter: blur(12px)`) and glowing hover states.
- 🛡️ **Clean & Secure Standard HTML/CSS/JS**: Zero external frameworks or heavy dependencies. Built with raw performance and accessibility in mind.

---

## 🛠️ Tech Stack

- **Markup**: HTML5 (Semantic Structure & Accessibility)
- **Styling**: Vanilla CSS3 (Custom CSS Properties, Grid, Flexbox, Animations)
- **Scripting**: JavaScript ES6+ (DOM Manipulation, Filter Logic, Scrollspy)
- **Icons**: FontAwesome 6.7.2

---

## 📁 Project Structure

```
Naruto-Portfolio/
├── index.html              # Main HTML entry point
├── css/
│   └── style.css           # Design tokens, component styles & responsive media queries
├── js/
│   └── script.js           # Navbar toggle, scrollspy, and mission filter handlers
├── assets/
│   ├── docs/               # Resume PDF & documentation guides
│   │   └── README.txt
│   ├── images/             # Profile photos & project screenshots
│   │   ├── profile.png
│   │   └── smart-fridge.jpg
│   ├── audio/
│   ├── fonts/
│   ├── icons/
│   └── videos/
└── README.md               # GitHub repository documentation
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AdityaRunwal/Naruto-Portfolio.git
   ```
2. **Navigate into Project Directory**:
   ```bash
   cd Naruto-Portfolio
   ```
3. **Open `index.html`**:
   - Simply double-click `index.html` to view in any modern browser (Chrome, Firefox, Edge, Safari).
   - Alternatively, serve via VS Code **Live Server** extension or Python HTTP server:
     ```bash
     python -m http.server 8000
     ```

---

## ⚙️ Customization Guide

### 1. Adding Your Resume PDF
Place your resume PDF file inside `assets/docs/` as `resume.pdf`:
```
assets/docs/resume.pdf
```
The "Resume PDF" button in the Hero section is pre-configured to automatically download this file.

### 2. Updating Your LinkedIn URL
Open `index.html`, locate the LinkedIn card (~line 363), and replace `YOUR_LINKEDIN_HANDLE` with your actual username:
```html
<a href="https://linkedin.com/in/adityarunwal" target="_blank" rel="noopener noreferrer">
    linkedin.com/in/adityarunwal
</a>
```

### 3. Adding New Missions (Projects)
To add a new project card, copy one of the `.project-card` blocks inside `index.html` under `#missions`:
```html
<div class="project-card" data-category="ml-eda">
    <div class="card-header-badge">
        <span class="mission-rank rank-a"><i class="fa-solid fa-certificate"></i> A-RANK MISSION</span>
    </div>
    <!-- Add image or placeholder -->
    <h3>Project Title</h3>
    <p>Project description...</p>
    <div class="tech-stack">
        <span>Python</span>
        <span>Machine Learning</span>
    </div>
    <div class="project-buttons">
        <a href="YOUR_GITHUB_REPO_URL" target="_blank" rel="noopener noreferrer" class="project-btn">
            <i class="fa-brands fa-github"></i> GitHub Code
        </a>
    </div>
</div>
```
- `data-category`: Choose from `"ai-iot"`, `"ml-eda"`, or `"deep-learning"`.
- `mission-rank`: Use `"rank-s"`, `"rank-a"`, or `"rank-b"`.

---

## 👤 Author

**Aditya Runwal**
- Email: [adityarunwal22@gmail.com](mailto:adityarunwal22@gmail.com)
- GitHub: [@AdityaRunwal](https://github.com/AdityaRunwal)
