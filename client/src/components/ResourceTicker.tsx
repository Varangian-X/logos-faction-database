import React, { useState, useEffect, useRef } from 'react';
import { useGameState, ResourceChangeLog } from '@/contexts/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  Cpu, 
  Zap, 
  Users, 
  Gem,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerNotification {
  id: string;
  log: ResourceChangeLog;
  visible: boolean;
}

const ResourceTicker = () => {
  const { resourceChangeLogs, clearResourceLogs } = useGameState();
  const [notifications, setNotifications] = useState<TickerNotification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const processedIds = useRef<Set<string>>(new Set());

  // Process new logs and create notifications
  useEffect(() => {
    const newLogs = resourceChangeLogs.filter(log => !processedIds.current.has(log.id));
    
    if (newLogs.length > 0) {
      const newNotifications = newLogs.map(log => ({
        id: log.id,
        log,
        visible: true,
      }));
      
      newLogs.forEach(log => processedIds.current.add(log.id));
      
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 20));
      
      // Auto-hide notifications after 5 seconds
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => newLogs.some(l => l.id === n.id) ? { ...n, visible: false } : n)
        );
      }, 5000);
    }
  }, [resourceChangeLogs]);

  const getResourceIcon = (type: ResourceChangeLog['resourceType']) => {
    switch (type) {
      case 'credits': return <Coins className="w-4 h-4" />;
      case 'metal': return <Gem className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'tech': return <Cpu className="w-4 h-4" />;
      case 'manpower': return <Users className="w-4 h-4" />;
      case 'stress': return <AlertTriangle className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const getResourceColor = (type: ResourceChangeLog['resourceType']) => {
    switch (type) {
      case 'credits': return 'text-yellow-400';
      case 'metal': return 'text-gray-300';
      case 'energy': return 'text-cyan-400';
      case 'tech': return 'text-purple-400';
      case 'manpower': return 'text-green-400';
      case 'stress': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const formatChange = (change: number) => {
    if (change >= 0) {
      return <span className="text-green-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{change}</span>;
    }
    return <span className="text-red-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />{change}</span>;
  };

  const visibleNotifications = notifications.filter(n => n.visible);

  if (visibleNotifications.length === 0 && !isExpanded) {
    return null;
  }

  return (
    <>
      {/* Floating Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {visibleNotifications.slice(0, 5).map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="pointer-events-auto"
            >
              <div className={cn(
                "bg-black/90 border rounded-lg px-4 py-2 backdrop-blur-sm shadow-lg min-w-[200px]",
                notification.log.changeAmount >= 0 ? "border-green-500/50" : "border-red-500/50"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded", getResourceColor(notification.log.resourceType))}>
                    {getResourceIcon(notification.log.resourceType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 uppercase">{notification.log.resourceType}</span>
                      <span className="text-sm font-bold">{formatChange(notification.log.changeAmount)}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {notification.log.source}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expandable History Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-80 bg-black/95 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <span className="text-sm font-bold text-yellow-500">Resource History</span>
              <div className="flex gap-2">
                <button 
                  onClick={clearResourceLogs}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
              {resourceChangeLogs.length > 0 ? (
                resourceChangeLogs.slice(0, 30).map(log => (
                  <div 
                    key={log.id} 
                    className="flex items-center gap-2 p-2 rounded bg-gray-900/50 text-xs"
                  >
                    <div className={getResourceColor(log.resourceType)}>
                      {getResourceIcon(log.resourceType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-gray-300 truncate">{log.source}</span>
                        {formatChange(log.changeAmount)}
                      </div>
                      {log.description && (
                        <div className="text-gray-500 truncate text-[10px]">{log.description}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No resource changes yet</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all",
          "bg-black/90 border border-gray-700 hover:border-yellow-500/50",
          isExpanded && "border-yellow-500"
        )}
      >
        <div className="relative">
          <Coins className="w-5 h-5 text-yellow-500" />
          {resourceChangeLogs.length > 0 && !isExpanded && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          )}
        </div>
      </button>
    </>
  );
};

export default ResourceTicker;
