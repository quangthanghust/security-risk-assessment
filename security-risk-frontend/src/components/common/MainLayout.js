import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff0f6' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '40px 0',
        background: '#fff0f6',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <div style={{ width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}