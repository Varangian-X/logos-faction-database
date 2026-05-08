import { useEffect } from 'react';

/**
 * Cartography Page Component
 * Embeds the Logos Imperium Architect's Edition v13 cartography interface
 * as a full-screen iframe for identical functionality to standalone version
 */
export default function Cartography() {
  useEffect(() => {
    // Ensure iframe takes full viewport
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'hidden';
    }
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <iframe
        src="/cartography.html"
        className="w-full h-full border-0"
        title="Logos Imperium Cartography - Architect's Edition v13"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
