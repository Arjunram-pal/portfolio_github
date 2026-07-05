# Portfolio Website

This repository is now prepared for **GitHub Pages** hosting as a **static HTML/CSS/JavaScript portfolio** with an optional **Supabase backend** for blog and daily routine content.

## What Changed

- Converted the site to static pages that GitHub can host directly
- Added root HTML files: `index.html`, `resume.html`, `blog.html`, `daily-routine.html`, and `contact.html`
- Replaced backend-only blog and daily routine features with editable static data in `static/site-data.js`
- Reworked the contact form to open the visitor's email app instead of calling a server API
- Added Supabase integration so blog posts and routine posts can be loaded and published without redeploying the site
- Added `admin.html` for authenticated content publishing
- Removed hardcoded secrets from the legacy Python backend

## Static Site Structure

```text
.
├── index.html
├── resume.html
├── blog.html
├── daily-routine.html
├── contact.html
├── admin.html
├── supabase-schema.sql
├── static/
│   ├── style.css
│   ├── script.js
│   ├── site-data.js
│   ├── supabase-config.js
│   ├── supabase-client.js
│   ├── admin.js
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

## Supabase Setup

1. Create a Supabase project
2. In the Supabase SQL editor, run [supabase-schema.sql](/mnt/f/python_programm/portfolio_git/supabase-schema.sql)
3. In Supabase, create one Auth user for yourself using `Authentication -> Users`
4. Open [static/supabase-config.js](/mnt/f/python_programm/portfolio_git/static/supabase-config.js)
5. Fill in:
   - `url`: your Supabase project URL
   - `anonKey`: your Supabase anon public key
   - `adminEmail`: your login email
6. Push the updated files to GitHub Pages

After that:
- visitors can read posts from Supabase
- you can sign in at [admin.html](/mnt/f/python_programm/portfolio_git/admin.html) and publish new content

## Updating Blog And Routine Content

- Preferred: use `admin.html` after Supabase is configured
- Fallback: edit `static/site-data.js` if you want sample local content while Supabase is not configured

- Update the `window.PORTFOLIO_BLOGS` array for blog posts
- Update the `window.PORTFOLIO_ROUTINE_POSTS` array for routine items

## Legacy Python Files

- `main.py` and the `templates/` folder are kept only as reference from the old FastAPI version
- They are not needed for GitHub Pages deployment

## Security Note

If those old secrets were ever pushed anywhere before this cleanup, rotate them in the original services.
