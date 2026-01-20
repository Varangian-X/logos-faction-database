import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpTooltip({ 
  content, 
  title,
  icon = 'help',
  side = 'top',
  className,
  triggerClassName,
  children 
}) {
  const Icon = icon === 'info' ? Info : HelpCircle;
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button 
              className={cn(
                "inline-flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors",
                triggerClassName
              )}
              type="button"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "max-w-xs bg-slate-900 border-slate-700 text-gray-200",
            className
          )}
        >
          {title && (
            <div className="font-semibold text-amber-300 mb-1 text-xs">
              {title}
            </div>
          )}
          <div className="text-xs leading-relaxed">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}