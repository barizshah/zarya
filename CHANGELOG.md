# Changelog

All notable changes to Zarya will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-09-22 — Initial Official Release

### ✨ Initial Release Features
- **Live 24-Hour Telemetry & UTC Time** — Real-time altitude, velocity, coordinates, overhead region, day/night visibility, and 24-hour UTC/local time across the entire dashboard
- **Live ISS Surface Meteorology** — Real-time temperature, cloud cover %, and surface weather conditions directly beneath the station at sub-satellite coordinates via Open-Meteo
- **ESA Precision Orbital Tracker** — Embedded live European Space Agency orbital tracker with live trajectory and day/night solar terminator
- **Multi-Feed Live Video Player** — Streamlined toggle between Sen 4K Ultra HD, NASA HD, and NASA SD with mission audio
- **3-Point SGP4 Flyover Predictions** — Accurate ISS pass predictions featuring 3-point trajectory (Start Azimuth/Elevation, Culmination Peak Elevation & Time, and Horizon Departure Azimuth/Elevation)
- **Naked-Eye Visual Magnitude & Daylight Filtering** — Apparent visual magnitude brightness ratings (`-3.5 mag Brilliant`, `Bright`, `Faint`) with intelligent filtering for Visible Twilight, Daylight Passes, and Unlit Night
- **Expedition 73 Crew Manifest** — Full astronaut roster with portraits, agencies, roles, bios, and days-in-space tracking
- **Upcoming Rocket Launches** — Real-time orbital launch schedules from Launch Library 2 with automatic fallback resilience
- **Space Agencies & Launch Sites** — Profiles of major global space agencies and spaceport coordinates
- **Orbital Overpass Facts** — Dynamic educational facts contextualized to the station's current ground track

### 📱 Mobile & UI Improvements
- **Zero Element Overlap** — Redesigned mobile layout for ISS Location and Surface Weather cards
- **Clean Pass Grid Layout** — Auto-fitting grid prevents single visible pass cards from over-stretching
- **Streamlined Camera Selector** — Simplified 4K, HD, and SD controls with 44px+ touch targets
- **Dark Mode Telemetry Aesthetic** — Mission-control inspired dark theme with `#76FF03` telemetry green accents

### 🔧 Architecture
- React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4
- Client-side zero-backend architecture with automatic fallbacks for telemetry and launch APIs
- GitHub Pages automated CI/CD deployment
