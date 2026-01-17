import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeLapseControlProps {
  currentYear: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export const TimeLapseControl: React.FC<TimeLapseControlProps> = ({
  currentYear,
  isPlaying,
  onPlayPause,
  onYearChange,
  minYear = 30400,
  maxYear = 30492,
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 p-4 rounded-xl backdrop-blur-md z-30 w-[400px] flex flex-col gap-3 shadow-2xl">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Temporal Archive</span>
        <span className="text-lg font-mono font-bold text-white">{currentYear} AD</span>
      </div>
      
      <Slider
        value={[currentYear]}
        min={minYear}
        max={maxYear}
        step={1}
        onValueChange={(vals) => onYearChange(vals[0])}
        className="cursor-pointer"
      />
      
      <div className="flex items-center justify-center gap-4 mt-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onYearChange(minYear)}
          className="text-white/50 hover:text-white hover:bg-white/10"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onPlayPause}
          className={cn(
            "w-10 h-10 rounded-full border-2 transition-all duration-300",
            isPlaying 
              ? "bg-[#D4AF37] border-[#D4AF37] text-black hover:bg-[#D4AF37]/90" 
              : "bg-transparent border-white/30 text-white hover:border-white hover:bg-white/10"
          )}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onYearChange(maxYear)}
          className="text-white/50 hover:text-white hover:bg-white/10"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
