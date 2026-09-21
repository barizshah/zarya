# Changelog

All notable changes to Zarya will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-09-21

### ✨ Added
- **Multi-feed live video player** — Switch between Sen 4K Ultra HD, NASA HD, and NASA SD/Mission Audio feeds with a single click
- **ESA ISS Ground Track** — Embedded live precision orbital tracker from the European Space Agency
- **Expedition 73 Crew Manifest** — Full crew cards with portraits, agencies, roles, bios, days-in-space counter, and fun facts
- **Upcoming Rocket Launches** — Live schedule from Launch Library 2 API with fallback data
- **Launch Sites Section** — Major global spaceports with descriptions and coordinates
- **Global Space Agencies** — Profiles for NASA, ESA, Roscosmos, JAXA, CSA, ISRO, CNSA, and more
- **Pass Prediction Engine** — Calculated ISS flyover times with elevation, azimuth direction, and brightness rating
- **Orbital Overpass Facts** — Dynamic fact banner based on current ISS ground position
- **About Modal** — App info with creator attribution, data sources, and feature overview
- **Crew Modal** — Full-screen crew roster dialog with enriched astronaut data
- **Stream Toggles Toolbar** — Quick-switch bar for camera feeds and section jump links
- **GitHub Pages deployment** — Automatic CI/CD via GitHub Actions on push to `main`

### 🎨 Improved
- Unified `animate-ping` live indicator pattern across ORBIT ACTIVE badge and Feeds label
- 44px+ minimum touch targets on all toolbar buttons for mobile usability
- Mobile-responsive layout: video/map stack vertically, compact padding at 768px and 480px breakpoints
- Polished About modal: scrollable content, GitHub link card, live ping dot in footer
- Cleaned up all unused Vite template boilerplate from `App.css`

### 🔧 Technical
- React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4
- ISS telemetry: WhereTheISS.at primary, SGP cloud function fallback, mathematical orbital simulation as last resort
- All data fetched client-side — zero backend required
- MIT License

---

## [1.0.0] — 2026-09-20

### ✨ Added
- Initial release with live ISS telemetry display
- Basic video feed embedding (YouTube iframes)
- Dark-mode-only UI with `#76FF03` telemetry green accent
- Altitude, velocity, and crew count info cards
- ISS location with reverse geocoding
