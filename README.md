# Portfolio Website

This repository is now prepared for **GitHub Pages** hosting as a **static HTML/CSS/JavaScript portfolio**.

## What Changed

- Converted the site to static pages that GitHub can host directly
- Added root HTML files: `index.html`, `resume.html`, `blog.html`, `daily-routine.html`, and `contact.html`
- Replaced backend-only blog and daily routine features with editable static data in `static/site-data.js`
- Reworked the contact form to open the visitor's email app instead of calling a server API
- Removed hardcoded secrets from the legacy Python backend

## Static Site Structure

```text
.
├── index.html
├── resume.html
├── blog.html
├── daily-routine.html
├── contact.html
├── static/
│   ├── style.css
│   ├── script.js
│   ├── site-data.js
│   └── images/
├── templates/
├── main.py
└── PROJECT_STRUCTURE.md
```

## Publish To GitHub Pages

1. Push this repository to GitHub
2. Open the repository on GitHub
3. Go to `Settings -> Pages`
4. Under `Build and deployment`, choose `Deploy from a branch`
5. Select your branch, usually `main`
6. Select the `/ (root)` folder
7. Save

GitHub Pages will publish `index.html` as your homepage.

## Updating Blog And Routine Content

- Edit `static/site-data.js`
- Update the `window.PORTFOLIO_BLOGS` array for blog posts
- Update the `window.PORTFOLIO_ROUTINE_POSTS` array for routine items

## Legacy Python Files

- `main.py` and the `templates/` folder are kept only as reference from the old FastAPI version
- They are not needed for GitHub Pages deployment

## Security Note

If those old secrets were ever pushed anywhere before this cleanup, rotate them in the original services.
