# Rose Health Center Buniadu – Website

Static site built with [Eleventy](https://www.11ty.dev/), editable through [Pages CMS](https://pagescms.org) and deployed on Netlify.

## Local development

```
npm install
npm start      # dev server with live reload at http://localhost:8080
npm run build  # outputs the static site to _site/
```

## Project structure

- `src/_data/home.yaml` — all text/images for the one-page homepage, grouped by section (hero, Geschichte, Klinik, Schule, Personal, Spenden).
- `src/_data/settings.yaml` — site-wide values used in several places: contact info, bank details, footer copyright.
- `src/impressum.md`, `src/datenschutz.md` — the two legal pages, as Markdown with frontmatter.
- `src/_includes/` — Nunjucks layouts/partials (`base.njk`, `header.njk`, `footer.njk`, `legal.njk`) and `index.njk`, the homepage template. These control layout/markup, not content.
- `src/css/styles.css`, `src/js/main.js`, `src/assets/` — unchanged from the original static site, copied through as-is.
- `.pages.yml` — the Pages CMS schema: defines which fields show up in the editing UI and their types (text, image, etc.).

**To change the design/layout:** edit the `.njk` files or `styles.css`.
**To change text or images (as the customer):** use Pages CMS — no code editing needed. See below.

## One-time setup (do this before handing off to the customer)

1. **Push this repo to GitHub.** Pages CMS and Netlify both connect to a Git repo.
   ```
   gh repo create rose-health-center --private --source=. --remote=origin --push
   ```
   (or create it manually on GitHub and `git remote add origin <url> && git push -u origin main`)

2. **Connect Netlify** to the GitHub repo (via [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"). It will auto-detect `netlify.toml` (build command `npm run build`, publish dir `_site`) and deploy on every push.

3. **Connect Pages CMS**:
   - Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
   - Select this repository. Pages CMS reads `.pages.yml` automatically and builds the editing interface from it.
   - Invite the customer as a collaborator on the GitHub repo (or add them as a Pages CMS user) so they can sign in and edit.

## How the customer edits content

1. Sign in at [app.pagescms.org](https://app.pagescms.org).
2. Open this site. They'll see editable sections: **Startseite** (homepage text/images, broken down by page section), **Allgemeine Einstellungen** (phone, email, address, bank details — shown in multiple places), **Impressum**, and **Datenschutz**.
3. Edit text fields or upload a replacement image, then save/commit.
4. Pages CMS commits the change to GitHub, which triggers a new Netlify build automatically — the live site updates within roughly a minute, with no code or technical steps required.

## Notes

- Image fields in Pages CMS point at `src/assets/img`; uploading a new image there keeps the same folder Eleventy already copies through on build.
- The `.webp` image fields are optional faster-loading variants of the matching `.jpg`; if left empty the browser just uses the `.jpg`.
- If Pages CMS's exact field-type names or UI differ slightly from what's described here (it evolves over time), the `.pages.yml` file is the source of truth — straightforward to adjust by editing the `type:` of a field.
