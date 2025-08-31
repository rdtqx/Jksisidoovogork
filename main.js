import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);

  const setDiscordStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/set-status', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setStatus(`Status set for ${data.user}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Discord Status Setter</h1>
      <p>Current status: {status}</p>
      <button 
        onClick={setDiscordStatus} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#5865F2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Setting Status...' : 'Set Status'}
      </button>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Note: This will set your status to "Playing 💤💤💤"
      </p>
    </div>
  );
}
