import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Lock, Unlock, Settings, Battery, Signal } from 'lucide-react';

const GateControlApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [gateStatus, setGateStatus] = useState('closed'); // 'open', 'closed', 'opening', 'closing'
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(3);
  const [isOperating, setIsOperating] = useState(false);

  // Check connection to ESP32
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`http://${ipAddress}/status`, {
          method: 'GET',
          timeout: 5000
        });
        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.connected || true);
          setBatteryLevel(85); // Could get from ESP32 if battery monitoring added
          setSignalStrength(Math.max(1, Math.min(4, Math.floor((data.rssi + 100) / 15))));
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();
    return () => clearInterval(interval);
  }, [ipAddress]);

  const sendGateCommand = async () => {
    if (!isConnected || isOperating) return;
    
    setIsOperating(true);
    try {
      const response = await fetch(`http://${ipAddress}/toggle`, {
        method: 'GET',
        timeout: 10000
      });
      
      if (response.ok) {
        // Simulate gate operation for UI feedback
        if (gateStatus === 'closed') {
          setGateStatus('opening');
          setTimeout(() => setGateStatus('open'), 3000);
        } else if (gateStatus === 'open') {
          setGateStatus('closing');
          setTimeout(() => setGateStatus('closed'), 3000);
        }
        console.log('Gate command sent successfully');
      } else {
        console.error('Failed to send gate command');
      }
    } catch (error) {
      console.error('Failed to send command:', error);
    } finally {
      setTimeout(() => setIsOperating(false), 2000);
    }
  };

  const getStatusColor = () => {
    switch (gateStatus) {
      case 'open': return 'text-green-500';
      case 'closed': return 'text-red-500';
      case 'opening': return 'text-yellow-500';
      case 'closing': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (gateStatus) {
      case 'open': return 'Gates Open';
      case 'closed': return 'Gates Closed';
      case 'opening': return 'Opening...';
      case 'closing': return 'Closing...';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">GF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">G-Force Gates</h1>
            <p className="text-sm text-blue-200">Solar Swing Gates</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Battery Level */}
          <div className="flex items-center space-x-1">
            <Battery className="w-5 h-5" />
            <span className="text-sm">{batteryLevel}%</span>
          </div>
          
          {/* Signal Strength */}
          <div className="flex items-center space-x-1">
            <Signal className="w-5 h-5" />
            <div className="flex space-x-1">
              {[1,2,3,4].map(i => (
                <div
                  key={i}
                  className={`w-1 h-3 bg-white rounded ${i <= signalStrength ? 'opacity-100' : 'opacity-30'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
          </div>
          
          {/* Settings */}
          <button
            onClick={() => setIsConfigMode(!isConfigMode)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      {isConfigMode && (
        <div className="p-6 bg-black/30 backdrop-blur-sm border-b border-white/10">
          <h3 className="text-lg font-semibold mb-4">Gate Controller Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ESP32 IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Connection Status</label>
              <div className={`px-3 py-2 rounded-lg ${isConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Control Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Gate Status */}
        <div className="text-center mb-12">
          <div className={`text-6xl mb-4 ${getStatusColor()}`}>
            {gateStatus === 'closed' ? <Lock /> : <Unlock />}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${getStatusColor()}`}>
            {getStatusText()}
          </h2>
          <p className="text-blue-200">
            {isConnected ? 'Ready to operate' : 'Connection lost'}
          </p>
        </div>

        {/* Control Button */}
        <button
          onClick={sendGateCommand}
          disabled={!isConnected || isOperating}
          className={`w-48 h-48 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
            !isConnected
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isOperating
              ? 'bg-yellow-500 text-yellow-900 animate-pulse'
              : gateStatus === 'closed'
              ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/30'
          }`}
        >
          {isOperating ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-yellow-900 border-t-transparent rounded-full animate-spin mb-2"></div>
              Operating...
            </div>
          ) : !isConnected ? (
            'Offline'
          ) : gateStatus === 'closed' ? (
            'OPEN\nGATES'
          ) : gateStatus === 'open' ? (
            'CLOSE\nGATES'
          ) : (
            'OPERATING...'
          )}
        </button>

        {/* Safety Warning */}
        <div className="mt-12 p-4 bg-yellow-500/20 border border-yellow-500/40 rounded-lg max-w-md text-center">
          <p className="text-yellow-200 text-sm">
            ⚠️ Always ensure the gate area is clear before operating.
            This app controls your gates remotely - use responsibly.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-blue-300 text-sm bg-black/20">
        <p>G-Force Automatic Gates • DSG5 DC2 Solar System</p>
        <p>Custom Mobile Control • Built for reliability</p>
      </div>
    </div>
  );
};

export default GateControlApp;
