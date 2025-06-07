# G‑Force Gate Controller PWA

A Progressive Web App (PWA) for remotely controlling a 12 V solar‑powered dual swing gate via an ESP32. Built with Create React App’s PWA template and deployed to GitHub Pages.

---

## 🚀 Features

* **Open/Close Gate**: single‑tap toggle of your gate.
* **Real‑time Status**: polls gate state (`open`/`closed`) every 5 seconds.
* **Signal Strength (RSSI)**: displays current Wi‑Fi link quality to the ESP32.
* **Offline Support**: caches assets and proxies API calls via a Service Worker.
* **Installable**: adds to home screen on iOS and Android as a standalone app.

---

## 🔧 Prerequisites

1. **Hardware**: ESP32‑S3‑Mini (or similar) flashed with the gate‑controller HTTP API firmware.
2. **Development Tools**:

   * Node.js ≥ 14 and npm (or Yarn).
   * Git and a GitHub account.
   * (Optional) GitHub CLI (`gh`) for repo creation.
3. **Network**:

   * ESP32 and client device on the same local network (unless you proxy via HTTPS).

---

## 🛠 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/stu2454/gateControl.git
   cd gateControl
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure endpoints**

   * In `package.json`, set:

     ```json
     "homepage": "https://<your‑username>.github.io/gateControl"
     ```
   * In `src/App.js`, update:

     ```js
     const API_BASE = 'https://<your‑username>.github.io/gateControl';
     ```
   * In `public/manifest.json`, confirm the `start_url` matches `/` or your sub‑path.
   * In `service-worker.js`, replace `http://192.168.x.x` with your ESP32’s local IP address.

4. **Place icons**

   * Copy your `icon-192x192.png` and `icon-512x512.png` into `public/icons/`.

---

## ⚙️ Development

Run the development server with hot‑reload:

```bash
npm start
```

Your PWA will open at `http://localhost:3000`. Service Worker won’t cache in dev mode, but you can iterate on React code and verify API calls directly.

---

## 📦 Build & Deploy

The `deploy` script builds and publishes to GitHub Pages (branch `gh-pages`):

```bash
npm run deploy
```

* **Predeploy**: `npm run build` compiles production assets.
* **Deploy**: `gh-pages -d build` uploads to GitHub.

Once complete, your app will be live at the `homepage` URL specified in `package.json`.

---

## 📱 Installation on iOS/Android

1. Open your GitHub Pages URL in Safari or Chrome on a mobile device.
2. **iOS**: Tap **Share → Add to Home Screen**.
3. **Android**: Tap **Menu → Add to Home Screen**.

Your PWA will install and launch without the browser chrome.

---

## 🐛 Troubleshooting & FAQs

### CORS Errors

If your browser console shows CORS or mixed‑content blockages:

* Ensure the ESP32 sets headers:

  ```http
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  ```
* Consider proxying API calls via the Service Worker (current setup) or serve the ESP32 API over HTTPS (e.g. mbedTLS or a reverse‑proxy).

### Peer‑Dependency Conflicts

If `npm install` fails with `ERESOLVE`:

* Run `npm install --legacy-peer-deps` to ignore strict peer checks.
* Or pin React to 18.x in `package.json` and reinstall.

### Service Worker Issues

* Verify that `service-worker.js` is registered (check `navigator.serviceWorker.controller`).
* In Chrome DevTools Application tab, unregister old SWs and reload.

---

## 🔮 Future Enhancements

* **HTTPS on ESP32**: secure end‑to‑end communication using mbedTLS or a small reverse‑proxy on your LAN.
* **Authentication**: simple token or basic auth to prevent unauthorised toggles.
* **WebSockets**: replace polling with a persistent WebSocket for near‑instant updates.
* **CI/CD**: integrate GitHub Actions to run tests, build, and deploy automatically on `main` pushes.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

*Questions or concerns?* Feel free to raise an issue or PR—this is a forward‑looking prototype, and every improvement counts!

