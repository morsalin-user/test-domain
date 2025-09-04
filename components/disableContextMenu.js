'use client';

import { useEffect } from 'react';

export default function DisableContextMenu() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return null;
}
