import React from 'react';

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.5rem 0' }}>
      <img
        src="/icons/logo_oscuro.svg"
        alt="Socado Logo"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '70px', objectFit: 'contain' }}
      />
    </div>
  );
};
