# 🎧 Spatial Sound Studio

System-wide spatial audio for Windows, macOS and Linux. It works with headphones, earbuds (wired or Bluetooth), laptop and desktop speakers, TV speakers and home theatre or soundbars.

Start it once, close the window (it keeps running in the system tray), then play YouTube, Spotify, games or movies as usual. Everything you play gets the spatial effect.

## Features

- **Binaural 3D (HRTF)** for headphones and earbuds
- **Virtual surround** (virtual L/R/C/rear speakers) for headphones, speakers and home theatre
- **Speaker widening** (mid/side) for laptop and TV speakers
- Room reverb, bass boost, stereo width, adjustable speaker angle
- Runs in the tray, optional launch at login, remembers your settings

## How it works

Apps can't be intercepted directly by a normal program, so the standard approach is a **virtual audio cable**:

```
YouTube / any app ──► Virtual cable (system output) ──► Spatial Sound Studio ──► your real headphones / speakers
```

You set your system output to the virtual cable once, and the app picks it up, processes it and plays it to your real device.

## One-time setup

### Windows
1. Install the free **VB-CABLE**: https://vb-audio.com/Cable/
2. Windows Sound settings → set the default output to **CABLE Input**.
3. In the app: *Capture from* = **CABLE Output**, *Play to* = your real headphones or speakers → **Start**.

### macOS
1. Install the free **BlackHole 2ch**: https://existential.audio/blackhole/
2. System Settings → Sound → Output → **BlackHole 2ch**.
3. In the app: *Capture from* = **BlackHole 2ch**, *Play to* = your real device → **Start**. Allow the microphone prompt (macOS treats audio inputs as the microphone; nothing is recorded).
4. BlackHole has no volume control, so use the app's Volume slider (or your headphones' own volume).

### Linux (PulseAudio / PipeWire)
```bash
pactl load-module module-null-sink sink_name=spatial
```
Set the system output to the `spatial` sink. In the app, *Capture from* = **Monitor of spatial**, *Play to* = your real device.

> Tip: if you switch Bluetooth headphones on or off, press **Refresh devices** in the app. Never pick the virtual cable as the *Play to* device, as it would create a feedback loop.

## Run from source

```bash
npm install
npm start
```

## Build installers locally

```bash
npm run dist
```
Installers appear in `dist/` (Windows: `.exe` installer and portable, macOS: `.dmg`, Linux: `.AppImage` and `.deb`). Build each OS on that OS (or use the GitHub workflow below).

## Publish a release on GitHub

1. Edit `package.json`: set `author`, `homepage` and `repository.url` (replace `YOUR_USERNAME`).
2. Create a repo on GitHub and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/spatial-sound-studio.git
   git push -u origin main
   ```
3. Tag a version to trigger the build:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. GitHub Actions builds for Windows, macOS and Linux and attaches the installers to a **draft release**. Open *Releases*, check the files, then click **Publish release**.

For a new version, bump `"version"` in `package.json` and push a new tag (`v1.0.1`).

## Notes

- Builds are **unsigned**. Windows SmartScreen may say "unknown publisher" (More info → Run anyway). On macOS, right-click the app → Open the first time. Code-signing certificates remove these warnings.
- Latency is typically 20–40 ms on wired devices. Bluetooth adds its own delay; for video it is usually compensated by the player.
- Exclusive-mode apps (some pro audio tools and games) can bypass the system output and therefore the virtual cable.

## License

MIT
