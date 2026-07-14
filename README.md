# launchsite

Short landing page: hero → what it does → real example videos → $15 founding-access offer. Static, Fly-hosted.

## Fill three blanks before shipping

1. **Brand name** — search-replace `Slipstream` / `slipstream` in `index.html` (nav, title, footer) once you buy the domain.
2. **Videos** — drop your finished mp4s in `videos/` and edit the `EXAMPLES` list at the bottom of `index.html` (company, url, href, video path). 9:16 portrait files look best. Delete rows you don't have.
3. **Dodo link** — replace `DODO_PAYMENT_LINK` in `index.html` with your Dodo Payments checkout URL ($15 one-time).

## Preview locally

```bash
cd launchsite && python3 -m http.server 8000   # open http://localhost:8000
```

## Deploy to Fly

```bash
fly launch --no-deploy   # or: fly apps create <name>, then edit fly.toml
fly deploy
```

Scales to zero when idle (min_machines_running = 0), so it's ~free until traffic. `videos/` ships inside the image; for many/large files later, move them to Fly volumes or a bucket and point the `video:` paths at the URLs.

## Notes

- Videos autoplay muted on hover, unmute on click. Keep each clip short.
- No testimonials section by design (add one only when you have real reactions).
