// src/App.js
import React, { useState, useEffect } from 'react';
import { Unlock, Lock } from 'lucide-react';

// Relative URL for Service Worker proxy
const apiBase = '';

function App() {
  const [status, setStatus] = useState({ connected: false, gate: 'unknown' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    async function fetchStatus() {
      try {
        const res = await fetch(`${apiBase}/status`, { mode: 'cors' });
        const { gate } = await res.json();
        setStatus({ connected: true, gate });
      } catch {
        setStatus({ connected: false, gate: 'unknown' });
      }
      timer = setTimeout(fetchStatus, 5000);
    }
    fetchStatus();
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = async () => {
    if (!status.connected || loading) return;
    setLoading(true);
    try {
      await fetch(`${apiBase}/toggle`, { method: 'POST', mode: 'cors' });
    } catch (e) {
      console.error('Toggle error:', e);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // Choose icon based on gate state
  const GateIcon = () => {
    if (status.gate === 'open') return <Unlock size={64} className="text-green-500" />;
    if (status.gate === 'closed') return <Lock size={64} className="text-red-500" />;
    return <div className="h-16" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Gate Controller</h1>
        <GateIcon />
        <p className="mt-4 mb-6 text-lg">
          {status.connected
            ? loading
              ? 'Processing...'
              : `Gate is ${status.gate}`
            : 'Offline'}
        </p>
        <button
          onClick={handleToggle}
          disabled={!status.connected || loading}
          className={`px-6 py-2 rounded text-white font-medium transition-colors disabled:opacity-50 ${
            status.gate === 'open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? '…' : status.gate === 'open' ? 'Close Gate' : 'Open Gate'}
        </button>
      </div>
    </div>
  );
}

export default App;
