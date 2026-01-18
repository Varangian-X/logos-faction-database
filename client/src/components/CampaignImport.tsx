import { useState, useRef } from 'react';
import { useCampaign, validateCampaignJSON } from '@/contexts/CampaignContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CampaignImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignImport({ open, onOpenChange }: CampaignImportProps) {
  const { importCampaign, savedScenarios } = useCampaign();
  const [importedData, setImportedData] = useState<any>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateCampaignJSON(data)) {
        toast.error('Invalid campaign file format', {
          description: 'The file does not contain valid campaign data.',
        });
        setImportedData(null);
        setIsLoading(false);
        return;
      }

      setImportedData(data);
      toast.success('File loaded successfully', {
        description: `Found ${data.length} scenarios to import.`,
      });
    } catch (error) {
      toast.error('Failed to read file', {
        description: error instanceof Error ? error.message : 'Unknown error occurred.',
      });
      setImportedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!importedData) return;

    try {
      importCampaign(importedData, importMode === 'merge');
      toast.success('Campaign imported successfully', {
        description: `${importedData.length} scenarios have been ${importMode === 'merge' ? 'added to' : 'replaced'} your campaign.`,
      });
      setImportedData(null);
      onOpenChange(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred.',
      });
    }
  };

  const handleCancel = () => {
    setImportedData(null);
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#D4AF37] font-serif">Import Campaign</DialogTitle>
          <DialogDescription className="text-white/60 font-mono text-xs">
            Restore or merge campaign records from a previously exported JSON file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!importedData ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
                <p className="text-sm font-mono text-white/70">Click to select JSON file</p>
                <p className="text-xs text-white/40 mt-1">or drag and drop</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-sm font-semibold text-green-400">File Valid</p>
                    <p className="text-xs text-green-300 mt-1">
                      {importedData.length} scenario{importedData.length !== 1 ? 's' : ''} ready to import
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs font-mono text-white/60 mb-3">Import Mode:</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      <span className="text-white font-semibold">Merge</span>
                      <span className="text-white/60 ml-2">Add to existing {savedScenarios.length} scenarios</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      <span className="text-white font-semibold">Replace</span>
                      <span className="text-white/60 ml-2">Clear existing and import new</span>
                    </span>
                  </label>
                </div>
              </div>

              {importMode === 'replace' && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">
                    Replace mode will delete your current {savedScenarios.length} scenarios
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20"
          >
            Cancel
          </Button>
          {importedData ? (
            <Button
              onClick={handleImport}
              className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold"
            >
              Import {importedData.length} Scenario{importedData.length !== 1 ? 's' : ''}
            </Button>
          ) : (
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold"
            >
              {isLoading ? 'Loading...' : 'Select File'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
