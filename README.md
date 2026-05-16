# New York Steven

A static 90s Geocities-inspired homepage for Steve.

## GitHub Pages

This repo is configured for GitHub Pages with the custom domain:

```text
newyorksteven.com
```

The deployment workflow publishes the repository root as a static site. The site entry point is `index.html`.

## DNS

In Cloudflare, point the apex domain to GitHub Pages with a DNS-only `CNAME` record:

```text
Name: newyorksteven.com
Target: kroy-the-rabbit.github.io
Proxy status: DNS only
```

If using `www.newyorksteven.com`, add another DNS-only `CNAME` record:

```text
Name: www
Target: kroy-the-rabbit.github.io
Proxy status: DNS only
```

## Local Preview

Open `index.html` directly in a browser.
