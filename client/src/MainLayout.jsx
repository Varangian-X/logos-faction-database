import React from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Target, Users, Zap, MapPin, Settings, Activity } from 'lucide-react';

export default function MainLayout({ children }) {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Command', icon: Shield },
    { path: '/fleet', label: 'Fleet', icon: Target },
    { path: '/personnel', label: 'Personnel', icon: Users },
    { path: '/research', label: 'Research', icon: Zap },
    { path: '/map', label: 'Starmap', icon: MapPin },
    { path: '/settings', label: 'System', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col overflow-hidden relative">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      {/* Top Status Bar */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-4">
          <div className="text-primary font-bold text-xl tracking-widest">LOGOS IMPERIUM</div>
          <div className="h-6 w-px bg-border" />
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Activity className="w-3 h-3 animate-pulse text-primary" />
            <span>SYS.ONLINE</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground">DATE</span>
            <span className="font-bold">2492.05.12</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground">CREDITS</span>
            <span className="text-primary">₪ 4,291,000</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <nav className="w-20 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-4 z-30">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`
                  w-12 h-12 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-100
                  border border-transparent hover:border-primary/50 hover:bg-primary/10
                  ${isActive ? 'border-primary bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,255,65,0.3)]' : 'text-muted-foreground'}
                `}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-[8px] uppercase">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 relative">
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-5" 
               style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom Command Bar */}
      <footer className="h-8 border-t border-border bg-card flex items-center justify-between px-4 text-[10px] text-muted-foreground z-40">
        <div>TERMINAL_ID: XJ-921-ALPHA</div>
        <div className="flex gap-4">
          <span>CPU: 12%</span>
          <span>MEM: 41%</span>
          <span>NET: SECURE</span>
        </div>
      </footer>
    </div>
  );
}
