# Contributing to Zarya

Thank you for your interest in contributing! Here's everything you need to get started.

---

## 🚀 Development Setup

### Prerequisites
- [Node.js](https://nodejs.org) ≥ 22
- [npm](https://npmjs.com) ≥ 10
- [Git](https://git-scm.com)

### Local Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/zarya.git
cd zarya

# Install dependencies
npm install

# Start dev server (hot reload at http://localhost:5173/zarya/)
npm run dev
```

---

## 📁 Project Structure

```
zarya/
├── public/              # Static assets (favicons, icons, world.geojson)
├── src/
│   ├── components/      # React UI components
│   ├── data/            # Static space data (agencies, launch sites, facts)
│   ├── services/        # API integrations (ISS telemetry, crew, launches)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Root app component + state
│   ├── index.css        # Global Tailwind + responsive overrides
│   ├── isslivenow.css   # Main app-wide stylesheet
│   └── main.tsx         # Entry point
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Code Style

- **TypeScript**: Strict mode enabled — no `any` unless unavoidable
- **Components**: Functional components with typed props interfaces
- **CSS**: Tailwind utility classes preferred; custom classes in `index.css` or `isslivenow.css`
- **Naming**: PascalCase for components, camelCase for utilities/hooks
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` new feature
  - `fix:` bug fix
  - `chore:` maintenance / refactor
  - `docs:` documentation

### Lint

```bash
npm run lint
```

---

## 🔃 Pull Request Process

1. **Create an issue first** for any non-trivial changes so we can discuss the approach
2. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes, ensuring:
   - `npm run build` completes without errors
   - `npm run lint` shows no new errors
4. Commit with a descriptive conventional commit message
5. Push and open a Pull Request — fill in the PR template
6. Wait for review — we aim to respond within 48 hours

---

## 🐛 Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS version
- Console errors (if any)

---

## 💡 Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Please check existing issues first to avoid duplicates.

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
