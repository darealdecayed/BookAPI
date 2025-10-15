import React from 'react';

export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <div style={{ padding: 8 }}>
      <strong>Socket:</strong> {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
