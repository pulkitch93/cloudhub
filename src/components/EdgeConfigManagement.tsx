import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Upload, Download, History, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EdgeDevice {
  id: string;
  name: string;
  type: string;
  configVersion: string;
  lastUpdated: Date;
}

interface ConfigHistory {
  version: string;
  timestamp: Date;
  changes: string;
  author: string;
}

const EdgeConfigManagement = () => {
  const [devices, setDevices] = useState<EdgeDevice[]>([
    {
      id: 'edge-001',
      name: '5G Node Alpha',
      type: '5G',
      configVersion: 'v2.1.3',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'edge-002',
      name: 'IoT Gateway Beta',
      type: 'IoT',
      configVersion: 'v2.1.2',
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'edge-003',
      name: 'Edge Server Gamma',
      type: 'Edge',
      configVersion: 'v2.1.3',
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'edge-004',
      name: '5G Node Delta',
      type: '5G',
      configVersion: 'v2.1.3',
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [configHistory] = useState<ConfigHistory[]>([
    {
      version: 'v2.1.3',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      changes: 'Updated security policies, increased timeout values',
      author: 'System Admin',
    },
    {
      version: 'v2.1.2',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      changes: 'Added new monitoring endpoints, optimized buffer sizes',
      author: 'DevOps Team',
    },
    {
      version: 'v2.1.1',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      changes: 'Fixed connectivity issues, updated certificates',
      author: 'Security Team',
    },
  ]);

  const { toast } = useToast();

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const selectAllDevices = () => {
    setSelectedDevices(devices.map((d) => d.id));
  };

  const deselectAllDevices = () => {
    setSelectedDevices([]);
  };

  const applyBulkUpdate = (version: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        selectedDevices.includes(device.id)
          ? { ...device, configVersion: version, lastUpdated: new Date() }
          : device
      )
    );

    toast({
      title: 'Configuration Updated',
      description: `Updated ${selectedDevices.length} device(s) to ${version}`,
    });

    setSelectedDevices([]);
  };

  const exportConfig = () => {
    toast({
      title: 'Configuration Exported',
      description: 'Configuration file downloaded successfully',
    });
  };

  const importConfig = () => {
    toast({
      title: 'Configuration Imported',
      description: 'Configuration file uploaded successfully',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device List */}
      <Card className="bg-card border-border lg:col-span-2">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Device Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Manage configurations across edge devices
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportConfig} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" variant="outline" onClick={importConfig} className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={selectAllDevices}>
              Select All
            </Button>
            <Button size="sm" variant="outline" onClick={deselectAllDevices}>
              Deselect All
            </Button>
            {selectedDevices.length > 0 && (
              <Badge variant="outline">
                {selectedDevices.length} selected
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="p-6 space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedDevices.includes(device.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
                onClick={() => toggleDeviceSelection(device.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => toggleDeviceSelection(device.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{device.name}</span>
                        <Badge variant="outline">{device.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Version: {device.configVersion}</span>
                        <span>•</span>
                        <span>Updated: {device.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {selectedDevices.length > 0 && (
          <div className="p-6 border-t border-border">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Apply Bulk Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply Configuration Update</DialogTitle>
                  <DialogDescription>
                    Update configuration for {selectedDevices.length} selected device(s)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Configuration Version</Label>
                    <Select defaultValue="v2.1.3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v2.1.3">v2.1.3 (Latest)</SelectItem>
                        <SelectItem value="v2.1.2">v2.1.2</SelectItem>
                        <SelectItem value="v2.1.1">v2.1.1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Update Notes</Label>
                    <Textarea placeholder="Optional notes about this update..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => applyBulkUpdate('v2.1.3')}>
                    Apply Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>

      {/* Version History */}
      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Version History</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configuration change log
          </p>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-6 space-y-4">
            {configHistory.map((entry, index) => (
              <div key={entry.version} className="relative">
                {index !== configHistory.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-px bg-border" />
                )}
                <div className="flex gap-3">
                  <div className="relative">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{entry.version}</span>
                      {index === 0 && (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {entry.changes}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{entry.author}</span>
                      <span>•</span>
                      <span>{entry.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default EdgeConfigManagement;
