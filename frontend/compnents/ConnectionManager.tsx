import React from 'react';
import { socket } from './socket';

export function ConnectionManager() {
  return (
    <div style={{ padding: 8 }}>
      <button onClick={() => socket.connect()}>Connect</button>
      <button onClick={() => socket.disconnect()} style={{ marginLeft: 8 }}>
        Disconnect
      </button>
    </div>
  );
}
