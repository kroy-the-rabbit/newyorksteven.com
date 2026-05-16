# New York Steven

A static 90s Geocities-inspired homepage for Steve.

## GitHub Pages

This repo is configured for GitHub Pages with the custom domain:

```text
newyorksteven.com
```

The deployment workflow publishes the repository root as a static site. The site entry point is `index.html`.

## DNS

Point the apex domain to GitHub Pages with these `A` records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional IPv6 `AAAA` records:

```text
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

If using `www.newyorksteven.com`, add a `CNAME` record pointing `www` to:

```text
kroy-the-rabbit.github.io
```

## Local Preview

Open `index.html` directly in a browser.
