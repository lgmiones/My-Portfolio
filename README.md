# Louell Grey Miones — Portfolio

Personal portfolio for a Full Stack Developer, built with **Angular 13** and **Motion** (Motion One).
Live: https://lgmionesportfolio.netlify.app/

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/my-portfolio
```

## Update the content

All copy, projects, experience and links live in one file:
`src/app/data/portfolio.data.ts`. Add a project by appending to `PROJECTS`
(set `featured: true` to show it on the home page). Screenshots go in
`src/assets/work/` (JPEG, ~1280px wide keeps pages fast).

## Structure

| Path | What it is |
| --- | --- |
| `src/app/pages/` | Home, Work (filterable index), About, Contact |
| `src/app/shared/` | Navbar, footer, illustrated Pickleball cover |
| `src/app/motion/` | Motion directives (`appReveal`, `appSplit`, `appStagger`, `appParallax`, `appMagnetic`, `appCountUp`) and the page-curtain transition service |
| `src/styles.css` | Design tokens (light/dark), type, buttons, shared layout |

Animations respect `prefers-reduced-motion`. `src/_redirects` keeps deep links
(e.g. `/work`) working on Netlify.
