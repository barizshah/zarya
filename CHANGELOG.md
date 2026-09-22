# Changelog

All notable changes to Zarya will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-09-22

### ✨ Features & Capabilities
- **Live 24-Hour Telemetry & UTC Time** — Real-time altitude, velocity, coordinates, overhead region, and 24-hour UTC/local time across the entire dashboard
- **Live ISS Surface Weather** — Real-time temperature, cloud cover %, and surface weather conditions at the ISS's sub-satellite coordinates via Open-Meteo
- **ESA Precision Orbital Tracker** — Embedded live European Space Agency orbital tracker with live trajectory and day/night terminator
- **Multi-Feed Live Video Player** — Streamlined toggle between Sen 4K Ultra HD, NASA HD, and NASA SD with mission audio
- **Global Pass Flyover Predictions** — Accurate flyover times with elevation, trajectory, observer daylight calculation, local timezone detection, and compact card layout
- **Expedition 73 Crew Manifest** — Full astronaut roster with portraits, agencies, roles, bios, and days-in-space tracking
- **Upcoming Rocket Launches** — Real-time launch schedules from Launch Library 2 with automatic fallback
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
