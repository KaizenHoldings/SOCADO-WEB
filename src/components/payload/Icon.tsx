import React from 'react';

export const Icon = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <img
        src="/icons/isotipo.svg"
        alt="Socado Icon"
        style={{ maxWidth: '100%', height: 'auto', maxHeight: '40px', objectFit: 'contain' }}
      />
    </div>
  );
};
