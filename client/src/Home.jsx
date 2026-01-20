import React from 'react';
import MainLayout from '../components/MainLayout';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Crosshair, Shield } from 'lucide-react';

// Mock components to replace missing ones for now
const StatCard = ({ label, value, trend, icon: Icon, color }) => (
  <div className="panel flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className="text-2xl font-bold font-mono">{value}</div>
    {trend && (
      <div className="text-xs flex items-center gap-1 text-primary">
        <TrendingUp className="w-3 h-3" />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary tracking-widest uppercase border-l-4 border-primary pl-4">
            Command Overview
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-destructive/20 border border-destructive text-destructive text-xs uppercase hover:bg-destructive/30 transition-colors">
              Red Alert
            </button>
            <button className="px-4 py-2 bg-primary/20 border border-primary text-primary text-xs uppercase hover:bg-primary/30 transition-colors">
              System Scan
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Fleet Readiness" value="87%" trend="+2.4%" icon={Shield} color="text-primary" />
          <StatCard label="Active Threats" value="3" icon={AlertTriangle} color="text-destructive" />
          <StatCard label="Resource Output" value="12.4k/hr" trend="+5.1%" icon={TrendingUp} color="text-amber-500" />
          <StatCard label="Target Acquisition" value="IDLE" icon={Crosshair} color="text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tactical Display Placeholder */}
          <div className="lg:col-span-2 panel min-h-[400px] flex flex-col">
            <div className="border-b border-border pb-2 mb-4 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase text-primary">Tactical Map</h2>
              <span className="text-[10px] text-muted-foreground">LIVE FEED</span>
            </div>
            <div className="flex-1 bg-black/50 border border-border/50 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-primary/5" />
                ))}
              </div>
              <div className="text-muted-foreground text-xs animate-pulse">
                [ TACTICAL GRID OFFLINE - AWAITING INPUT ]
              </div>
            </div>
          </div>

          {/* Notifications / Log */}
          <div className="panel flex flex-col">
            <div className="border-b border-border pb-2 mb-4">
              <h2 className="text-sm font-bold uppercase text-primary">Comms Log</h2>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-2 border-l-2 border-border bg-black/20 text-xs font-mono">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>CMD-CTR</span>
                    <span>14:0{i}</span>
                  </div>
                  <p className="text-foreground/80">
                    Sector 7G scan complete. No anomalies detected. Proceeding to next waypoint.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
