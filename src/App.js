// src/App.js
import React, { useState, useEffect } from 'react';

// Use relative paths so the Service Worker can proxy to your ESP32
const API_BASE = '';

function App() {
  const [status, setStatus] = useState({ connected: false, gate: 'unknown', rssi: null });

  // Poll the controller status every 5 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/status`, { mode: 'cors' });
        const data = await res.json();
        setStatus({
          connected: true,
          gate: data.gate,    // expects 'open' or 'closed'
          rssi: data.rssi,
        });
      } catch {
        setStatus(s => ({ ...s, connected: false }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleGate = async () => {
    try {
      await fetch(`${API_BASE}/toggle`, { method: 'POST', mode: 'cors' });
      // Give the controller time to change state
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>G-Force Gate Controller</h1>
      <p>Status: {status.connected ? 'Online' : 'Offline'}</p>
      <p>Gate is: {status.gate}</p>
      <p>Signal: {status.rssi !== null ? `${status.rssi} dBm` : '—'}</p>
      <button
        onClick={toggleGate}
        disabled={!status.connected}
        style={{ padding: '1rem', fontSize: '1.2rem' }}
      >
        {status.gate === 'open' ? 'Close Gate' : 'Open Gate'}
      </button>
    </div>
  );
}

export default App;
