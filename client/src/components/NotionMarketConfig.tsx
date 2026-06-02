/**
 * Notion Market Configuration Component
 * Manages Notion API token and sync settings
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle, Loader2, Key, RefreshCw } from 'lucide-react';

interface NotionMarketConfigProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  onAuthenticate: (token: string) => Promise<boolean>;
  onSync: () => Promise<void>;
}

export function NotionMarketConfig({
  isAuthenticated,
  isLoading,
  error,
  lastSync,
  onAuthenticate,
  onSync,
}: NotionMarketConfigProps) {
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAuthenticate = async () => {
    if (!token.trim()) return;

    const success = await onAuthenticate(token);
    if (success) {
      setToken('');
      setIsOpen(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-black/40 border-[#D4AF37]/20">
      <CardHeader>
        <CardTitle className="text-[#D4AF37] flex items-center gap-2">
          <Key className="w-4 h-4" />
          Notion Integration
        </CardTitle>
        <CardDescription>
          Connect your Notion Factions and Resources registries for live market data
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-black/60 rounded border border-white/10">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-400">Connected to Notion</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-yellow-400">Not connected</span>
              </>
            )}
          </div>
          <span className="text-xs text-white/50">Last sync: {formatLastSync(lastSync)}</span>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    {isAuthenticated ? 'Update Token' : 'Connect Notion'}
                  </>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#0A0E17] border-[#D4AF37]/30">
              <DialogHeader>
                <DialogTitle className="text-[#D4AF37]">Notion API Token</DialogTitle>
                <DialogDescription>
                  Paste your Notion integration token to connect your registries
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="ntn_..."
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="bg-black/60 border-white/10 text-white placeholder:text-white/30"
                />

                <div className="text-xs text-white/50 space-y-1">
                  <p>
                    Get your token from:{' '}
                    <a
                      href="https://www.notion.so/my-integrations"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline"
                    >
                      notion.so/my-integrations
                    </a>
                  </p>
                  <p>Make sure to share both registries with your integration.</p>
                </div>

                <Button
                  onClick={handleAuthenticate}
                  disabled={!token.trim() || isLoading}
                  className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Connect'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleSync}
            disabled={!isAuthenticated || isSyncing}
            className="flex-1 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/30"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-white/50 p-3 bg-black/40 rounded border border-white/5">
          <p className="font-mono">
            Synced Resources: <span className="text-[#D4AF37]">Fetching from Notion...</span>
          </p>
          <p className="font-mono mt-1">
            Active Factions: <span className="text-[#D4AF37]">Fetching from Notion...</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
