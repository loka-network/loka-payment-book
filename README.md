# Loka Payment Docs

Technical documentation site for the Loka Payment stack — a Lightning-native
settlement rail for AI agents, settling on BTC · SUI · EVM.

The site is a pure-static React app (JSX transpiled in-browser by Babel
Standalone). No build step. Open `index.html` directly, or deploy as-is to
any static host.

## Run locally

```bash
# any static server works
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

### Vercel (recommended — zero-config)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Accept the defaults — `vercel.json` tells Vercel there's no build step.
4. Hit **Deploy**. You get a `*.vercel.app` URL within a minute.

Custom domain: Settings → Domains → add `docs.lokachain.org` (or whatever
hostname), then point a CNAME at `cname.vercel-dns.com`.

### GitHub Pages (workflow included)

Already wired up in `.github/workflows/pages.yml`:

1. Settings → Pages → Source = **GitHub Actions**
2. Push to `main` — the workflow stages the site (excluding `.git`,
   `screenshots/`, `uploads/`, etc.) and publishes it.

Custom domain: drop a `CNAME` file at the repo root with your hostname,
then add a CNAME / ALIAS record pointing to `<org>.github.io`.

### Cloudflare Pages

Same idea: import the repo, set framework = "None", build command = empty,
output directory = `.` (root).

## File layout

```
index.html                # entry point (loads React, Babel, mermaid, all .jsx)
styles.css                # all theme tokens, layout, components
app.jsx                   # sidebar shell, routing, search
primitives.jsx            # shared components — ProjectHero, StarCta, SkillInstallButton, Mermaid …
payment-pulse.jsx         # animated SVG on the Overview hero
content-overview.jsx      # Overview · Introduction · Tech Stack · Data Flow
content-paycli.jsx        # Pay CLI
content-prism.jsx         # L402 Gateway
content-aps.jsx           # Agent Wallets
content-aps-extras.jsx    # Agent Wallets · Security (TEE / ZK)
content-lnd.jsx           # Lightning Node
content-lnd-extras.jsx    # Lightning Node · HTLC + USDT-on-EVM deep dives
content-chain.jsx         # Settlement Chain (multi-chain · BTC · SUI · EVM · loka-chain)
content-sdk.jsx           # Go SDK (MORE group)
content-ecosystem.jsx     # adjacent loka-network repositories

vercel.json               # Vercel deploy config (no build, static headers)
.github/workflows/pages.yml   # GitHub Pages deploy workflow
```

## Editing

Every page is a regular JSX file. Pick the project tab you want to edit:

- `content-paycli.jsx` for Pay CLI
- `content-prism.jsx` for L402 Gateway
- etc.

Reload — the browser re-transpiles JSX on the fly via Babel Standalone, so
there is no compile step. For production you may want to pre-compile and
ship the transpiled JS instead; for documentation traffic at this scale
the on-the-fly approach is fine and keeps the source readable.

## License

MIT.
