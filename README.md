# G-Force Gate Controller PWA

A Progressive Web App (PWA) for remotely controlling a 12 V solar-powered dual swing gate via an ESP32. Built with Create React App’s PWA template, enhanced with Tailwind CSS and deployed to GitHub Pages.

---

## 🚀 Features

- **Open/Close Gate**: single-tap toggle of your gate.
- **Real-time Status**: polls gate state (`open`/`closed`) every 5 seconds.
- **Signal & Battery**: displays Wi‑Fi RSSI and simulated battery level.
- **Offline Support**: caches assets and proxies API calls via a Service Worker.
- **Installable**: adds to home screen on iOS and Android as a standalone app.
- **Modern UI**: uses Tailwind CSS + lucide-react icons.

---

## 🔧 Prerequisites

1. **Hardware**: ESP32-S3 (or similar) flashed with the gate-controller HTTP API firmware.
2. **Development Tools**:
   - Node.js ≥ 14 and npm (or Yarn).
   - Git & GitHub account.
   - (Optional) GitHub CLI (`gh`).
3. **Network**: ESP32 and client device on the same local network unless proxied.

---

## 🛠 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/stu2454/gateControl.git
   cd gateControl
   ```

2. **Install core dependencies**
   ```bash
   npm install
   ```

3. **install PWA publisher & icons**
   ```bash
   npm install --save-dev gh-pages
   npm install lucide-react
   ```

4. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

5. **Configure Tailwind**
   - **tailwind.config.js** (auto-generated):
     ```js
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
       theme: { extend: {} },
       plugins: [],
     }
     ```
   - **src/index.css**: replace contents with:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - **Import** in `src/index.js` if not already:
     ```js
     import './index.css';
     ```

6. **Configure endpoints & assets**
   - In `package.json`, set:
     ```json
     "homepage": "https://<your-user>.github.io/gateControl"
     ```
   - In `src/App.js`, ensure:
     ```js
     const apiBase = '';  // relative paths for SW proxy
     ```
   - In `service-worker.js`, replace `http://192.168.x.x` with your ESP32 IP.
   - Place `icon-192x192.png` and `icon-512x512.png` in `public/icons/`.

---

## ⚙️ Development

Run the dev server with hot‑reload and Tailwind:

```bash
npm start
```

Browse `http://localhost:3000` (or your machine’s LAN IP) on any device to test gate controls and UI.

---

## 📦 Build & Deploy

Build and publish to GitHub Pages:

```bash
npm run deploy
```

This runs:
1. `npm run build` (CRA + Tailwind production build)
2. `gh-pages -d build`

Your app will go live at the `homepage` URL.

---

## 📱 Install as PWA

1. Open your Pages URL on mobile.
2. **iOS**: Safari → Share → Add to Home Screen.
3. **Android**: Chrome → Menu → Add to Home Screen.

---

## 🐛 Troubleshooting

- **`npx tailwindcss init -p` error**: ensure `tailwindcss` is installed as a dev dep. Run:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```

- **CORS or mixed‑content**: your PWA served over HTTPS will block HTTP calls. Either run locally over HTTP (`npm start`), proxy via SW, or add HTTPS to the ESP32.

- **`deploy` script missing**: ensure `gh-pages` is in devDependencies and `scripts` include:
  ```jsonc
  "predeploy": "npm run build",
  "deploy":    "gh-pages -d build"
  ```

---

## 🔮 Future Enhancements

- **HTTPS on ESP32** via mbedTLS.
- **Auth**: token/basic auth for `/toggle`.
- **WebSockets**: replace polling for instant updates.
- **CI**: GitHub Actions to auto-build & deploy on push.

---

## 📜 License

MIT. See `LICENSE`.

---

*Contributions welcome!* Feel free to open issues or PRs for UI tweaks, security improvements, or new features.

