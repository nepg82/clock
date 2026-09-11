# Clock PWA

## Setup

Drop your own files into these two folders (already referenced by path in the code, nothing else to edit):

- `font/dseg14classic_italic.ttf`
- `app-icons/app-icon-192.png`
- `app-icons/app-icon-512.png`

Then serve the folder over HTTPS (or localhost) — service workers and installable PWAs won't work over `file://` or plain HTTP. Easiest local test:

```
cd clock-pwa
python3 -m http.server 8000
```

Then visit `http://localhost:8000` on your phone (same network) or deploy the folder to any static host (GitHub Pages, Netlify, Vercel, etc.) and visit the HTTPS URL. From there, "Add to Home Screen" to install it.

## How it works

- **Time**: 12-hour format, no seconds, no date, updates every minute.
- **Auto-fill sizing**: on load, resize, and orientation change, JS measures the rendered clock text against the visible frame and sets `font-size` so the time fills ~90% of the width and ~82% of the height.
- **Force-rotate button**: bottom-right (or top-right once rotated) circular button. It doesn't use the Screen Orientation API — that's unreliable on iOS and can't override a phone's rotation lock anyway. Instead it applies a pure CSS `rotate(90deg)` transform to the clock frame and swaps its width/height, so it visually fills the screen in landscape even while the phone is physically held in portrait with auto-rotate off.
- **Offline**: a service worker caches the app shell (HTML, manifest, font, icons) so it keeps working without a network connection once loaded.
- **Screen wake lock**: requests `navigator.wakeLock` where supported, so the screen doesn't dim/sleep while the clock is open (falls back silently where unsupported, e.g. older iOS).

## Notes

- `display: "fullscreen"` in the manifest hides browser chrome when installed to the home screen; it falls back to normal browser display until then.
- Everything is a single `index.html` (no build step, no dependencies) plus `manifest.json` and `sw.js`.
