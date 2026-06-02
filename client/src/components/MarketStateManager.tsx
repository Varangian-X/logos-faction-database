/**
 * Market State Manager Component
 * Export/Import JSON snapshots, push to Notion, manage market data
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Upload,
  Send,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
} from 'lucide-react';
import {
  exportMarketStateToFile,
  importMarketStateFromFile,
  validateMarketState,
  type MarketStateSnapshot,
} from '@/lib/marketState';
import { pushMarketStateToNotionPage, validateNotionConfig, type NotionConfig } from '@/lib/notionApi';

interface MarketStateManagerProps {
  currentState: MarketStateSnapshot;
  onStateImported: (state: MarketStateSnapshot) => void;
  onStateExported?: (state: MarketStateSnapshot) => void;
}

export function MarketStateManager({
  currentState,
  onStateImported,
  onStateExported,
}: MarketStateManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [notionToken, setNotionToken] = useState('');
  const [notionPageId, setNotionPageId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Validate current state
  const validation = validateMarketState(currentState);

  // Export to JSON file
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `market-state-${new Date().toISOString().split('T')[0]}.json`;
      exportMarketStateToFile(currentState, filename);
      setMessage({ type: 'success', text: `Exported: ${filename}` });
      onStateExported?.(currentState);
    } catch (error) {
      setMessage({ type: 'error', text: `Export failed: ${error}` });
    } finally {
      setIsExporting(false);
    }
  };

  // Import from JSON file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedState = await importMarketStateFromFile(file);
      const validation = validateMarketState(importedState);

      if (!validation.valid) {
        setMessage({
          type: 'error',
          text: `Invalid state format: ${validation.errors.join(', ')}`,
        });
        return;
      }

      onStateImported(importedState);
      setMessage({
        type: 'success',
        text: `Imported ${importedState.items.length} items and ${importedState.factions.length} factions`,
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Import failed: ${error}` });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Push to Notion
  const handlePushToNotion = async () => {
    if (!notionToken || !notionPageId) {
      setMessage({ type: 'error', text: 'Missing Notion token or page ID' });
      return;
    }

    setIsPushing(true);
    try {
      const config: NotionConfig = {
        token: notionToken,
        pageId: notionPageId,
        factionsDatabaseId: currentState.metadata.notionFactionsDatabaseId || '',
        resourcesDatabaseId: currentState.metadata.notionResourcesDatabaseId || '',
      };

      const validation = await validateNotionConfig(config);
      if (!validation.valid) {
        setMessage({
          type: 'error',
          text: `Notion config invalid: ${validation.errors.join(', ')}`,
        });
        return;
      }

      const result = await pushMarketStateToNotionPage(currentState, config);
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message,
      });

      if (result.success && result.pageUrl) {
        // Open Notion page in new tab
        window.open(result.pageUrl, '_blank');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Push failed: ${error}` });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="border-[#D4AF37]/30 bg-black/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-[#D4AF37]">MARKET STATE STATUS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Items:</span>
            <Badge variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37]">
              {currentState.items.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Factions:</span>
            <Badge variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37]">
              {currentState.factions.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Last Updated:</span>
            <span className="text-white/40 font-mono">
              {new Date(currentState.timestamp).toLocaleString()}
            </span>
          </div>
          {!validation.valid && (
            <Alert className="mt-2 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-xs text-red-400">
                {validation.errors[0]}
              </AlertDescription>
            </Alert>
          )}
          {validation.valid && (
            <Alert className="mt-2 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-xs text-green-400">
                State is valid and ready for export
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <Alert
          className={`border-opacity-50 ${
            message.type === 'success'
              ? 'border-green-500/50 bg-green-500/10'
              : 'border-red-500/50 bg-red-500/10'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription
            className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting || !validation.valid}
          className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/30 font-mono text-xs uppercase"
          variant="outline"
        >
          <Download className="w-3 h-3 mr-1" />
          {isExporting ? 'Exporting...' : 'Export JSON'}
        </Button>

        {/* Import Button */}
        <Button
          onClick={handleImportClick}
          disabled={isImporting}
          className="bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF]/30 font-mono text-xs uppercase"
          variant="outline"
        >
          <Upload className="w-3 h-3 mr-1" />
          {isImporting ? 'Importing...' : 'Import JSON'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>

      {/* Notion Push Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 text-[#FF6B6B] hover:bg-[#FF6B6B]/30 font-mono text-xs uppercase"
            variant="outline"
          >
            <Send className="w-3 h-3 mr-1" />
            Push to Notion Page
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0A0E17] border-[#D4AF37]/30">
          <DialogHeader>
            <DialogTitle className="text-[#D4AF37] font-mono">
              PUSH MARKET STATE TO NOTION
            </DialogTitle>
            <DialogDescription className="text-white/60 text-xs">
              Send your market state snapshot to a Notion page for archival and sharing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Token Input */}
            <div>
              <label className="text-xs font-mono text-white/70 mb-1 block">
                NOTION INTEGRATION TOKEN
              </label>
              <Input
                type="password"
                placeholder="secret_xxxxx..."
                value={notionToken}
                onChange={(e) => setNotionToken(e.target.value)}
                className="bg-black/40 border-[#D4AF37]/30 text-white text-xs font-mono"
              />
              <p className="text-[10px] text-white/40 mt-1">
                Get from https://www.notion.so/my-integrations
              </p>
            </div>

            {/* Page ID Input */}
            <div>
              <label className="text-xs font-mono text-white/70 mb-1 block">
                NOTION PAGE ID
              </label>
              <Input
                placeholder="3729d61ecf6b814aac1df7447ba5c065"
                value={notionPageId}
                onChange={(e) => setNotionPageId(e.target.value)}
                className="bg-black/40 border-[#D4AF37]/30 text-white text-xs font-mono"
              />
              <p className="text-[10px] text-white/40 mt-1">
                From your Notion page URL (32-character ID)
              </p>
            </div>

            {/* Push Button */}
            <Button
              onClick={handlePushToNotion}
              disabled={isPushing || !notionToken || !notionPageId}
              className="w-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 text-[#FF6B6B] hover:bg-[#FF6B6B]/30 font-mono text-xs uppercase"
              variant="outline"
            >
              <Send className="w-3 h-3 mr-1" />
              {isPushing ? 'Pushing...' : 'Push to Notion'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="border-white/10 bg-black/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono text-white/70">HOW IT WORKS</CardTitle>
        </CardHeader>
        <CardContent className="text-[10px] text-white/50 space-y-1">
          <p>
            💾 <strong>Export:</strong> Save your market state as JSON with all items, factions, and
            image URLs
          </p>
          <p>
            📥 <strong>Import:</strong> Load a previously saved state to restore your market data
          </p>
          <p>
            📤 <strong>Push to Notion:</strong> Send state snapshot to a Notion page for archival
          </p>
          <p>
            🖼️ <strong>Images:</strong> All images are referenced by URL, not embedded in JSON
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
