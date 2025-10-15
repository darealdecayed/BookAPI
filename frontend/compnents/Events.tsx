import React from 'react';

export function Events({ events }: { events: any[] }) {
  return (
    <div style={{ padding: 8 }}>
      <strong>Events</strong>
      <ul>
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
