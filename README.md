# AI Skill Gap → Job Readiness Mapper (Scaler)

Tool for software job seekers: check readiness for Backend, Full Stack, or Data Engineering roles and see skill gaps. Runs 100% in the browser.

## Deploy to Vercel

1. Push this repo to GitHub (e.g. **DJ1505/scaler-funnel**).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. Import your GitHub repo. Use default settings (or **Output Directory**: `.`).
4. Click **Deploy**. Site will be at `https://your-project.vercel.app`.

No build step. No server. All logic runs in the browser (`analysis-browser.js`).

## Files (for Vercel)

| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `analyzer.html` | Check readiness (resume/JD + role) |
| `style.css` | Styles |
| `analyzer.js` | UI and form logic |
| `analysis-browser.js` | Readiness scoring (in-browser) |
| `config.js` | Optional config |
| `vercel.json` | Vercel: static output |

## Optional: GitHub Pages

Repo **Settings** → **Pages** → **Deploy from branch** → **main** → Save.  
Live at `https://<username>.github.io/scaler-funnel/`.
