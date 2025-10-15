import React, { useState } from 'react';
import { socket } from './socket';

export function MyForm() {
  const [value, setValue] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    socket.emit('foo',JSON.stringify( { text: value, time: Date.now() }));
    setValue('');
  }

  return (
    <form onSubmit={submit} style={{ padding: 8 }}>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type something" />
      <button type="submit" style={{ marginLeft: 8 }}>Send</button>
    </form>
  );
}
