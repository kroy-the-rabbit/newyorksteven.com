# New York Steven

A 90s Geocities-inspired homepage for Steve, served by a Cloudflare Worker.
The visitor counter and guestbook are stored in Cloudflare D1 (SQLite).

## Layout

```text
public/       static site (HTML, CSS, JS, images)
src/worker.js API routes, falls through to static files
migrations/   D1 schema and the original guestbook entries
```

## API

| Route                 | Does                                              |
|-----------------------|---------------------------------------------------|
| `GET /api/visit`      | Current visitor count                             |
| `POST /api/visit`     | Add one visit, return the new count               |
| `GET /api/guestbook`  | Up to 50 entries: visitor posts newest first, then the originals shuffled |
| `POST /api/guestbook` | `{ name, message }`; 3 posts per IP per 10 minutes |

## Local development

Everything runs in Docker (Podman works too).

```sh
docker compose up --build
```

Open http://localhost:8787. Local D1 data lives in `.wrangler/` and survives restarts.
Delete `.wrangler/` to reset to the seeded state.

## First deploy

1. Create a Cloudflare API token with the "Edit Cloudflare Workers" template plus D1 edit permission.
2. The D1 database `steve-db` already exists and its id is in `wrangler.jsonc`.
3. In Cloudflare DNS, delete the `newyorksteven.com` and `www` CNAME records that point to GitHub Pages.
   The Worker creates its own records for the custom domains on deploy.
4. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets.
5. Push to `main`. The workflow applies migrations and deploys.
6. In the GitHub repo settings, disable GitHub Pages.

Optional: set a salt for the hashed IPs used by the rate limiter:

```sh
docker compose run --rm site npx wrangler secret put IP_SALT
```
