# Static deployment

The site is ready to build locally; no deployment has been performed. Use Node.js 22.12+ and `npm ci`. Run `npm test`, `npm run test:e2e`, and `npm run build` before release.

## Production domain

Set the build environment variable `SITE_URL` to the actual HTTPS origin, without a path, query, or fragment. The build generates `public/sitemap.xml`, adds its reference to robots.txt, and injects canonical and Open Graph URLs. Sitemap entries follow published local content; drafts are omitted. With no domain configured, sitemap and canonical tags are intentionally omitted. This is the canonical URL placeholder workflow; no example domain is advertised to search engines.

## Netlify

Import the repository, choose `npm run build` as the build command and `dist` as the publish directory, and configure `SITE_URL`. These build settings are also in `netlify.toml`. `public/_redirects` is copied to the output and contains:

```text
/* /index.html 200
```

This serves the React application on deep-link refreshes while preserving existing static assets. See [Netlify’s SPA rewrite documentation](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps).

## Vercel

Import as a Vite project. Use `npm run build` and output directory `dist`. Configure `SITE_URL`. The checked-in `vercel.json` rewrites extensionless routes to `/index.html`; static assets retain their normal paths. Resource slugs should not contain dots. See [Vercel rewrites](https://vercel.com/docs/routing/rewrites).

## Release verification

Open and refresh `/classes/class-6`, a published course detail, and a lesson URL directly. Check mobile navigation, source links, and theme. Test videos on the real domain: private, removed, age-restricted, or embedding-disabled content can fail independently of this site. A permanent “open on YouTube” fallback is provided because cross-origin embed restrictions cannot be reliably detected with iframe load events.

There is no service worker and no video or embed caching. The manifest provides app identity and standalone display metadata; it does not promise offline lessons. Client-rendered metadata and a sitemap do not guarantee rich social previews for every route. If per-course crawler-rendered previews are required later, add static prerendering as a separate enhancement.
