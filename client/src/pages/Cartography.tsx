import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cartography Page Component
 * Embeds the Logos Imperium Architect's Edition v13 cartography interface
 * as a full-screen iframe for identical functionality to standalone version
 */
export default function Cartography() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Ensure iframe takes full viewport
    const root = document.getElementById('root');
    if (root) {
      root.style.overflow = 'hidden';
    }
  }, []);

  const handleBack = () => {
    setLocation('/');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      {/* Back Button - Positioned over iframe */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="bg-black/80 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-black hover:border-[#D4AF37] hover:text-[#D4AF37] font-mono text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-sm"
          title="Return to Faction Tracker"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO TRACKER
        </Button>
      </div>

      {/* Cartography iframe */}
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
