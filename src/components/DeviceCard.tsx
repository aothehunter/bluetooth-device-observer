
import React, { useState } from 'react';
import { BluetoothDevice } from '@/types/bluetooth';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Battery, 
  BatteryFull, 
  BatteryLow, 
  BatteryMedium, 
  BatteryWarning,
  BluetoothConnected, 
  BluetoothOff,
  CircleCheck,
  CircleX
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceCardProps {
  device: BluetoothDevice;
  onToggleConnection: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggleConnection, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [customName, setCustomName] = useState(device.customName || '');

  const getBatteryIcon = () => {
    if (device.batteryLevel === null || device.batteryLevel === undefined) {
      return <Battery className="h-5 w-5 text-gray-400" />;
    }
    
    if (device.batteryLevel > 75) {
      return <BatteryFull className="h-5 w-5 text-windows-green" />;
    } else if (device.batteryLevel > 40) {
      return <BatteryMedium className="h-5 w-5 text-green-500" />;
    } else if (device.batteryLevel > 15) {
      return <BatteryLow className="h-5 w-5 text-yellow-500" />;
    } else {
      return <BatteryWarning className="h-5 w-5 text-windows-orange" />;
    }
  };

  const handleSubmitRename = () => {
    onRename(device.id, customName);
    setIsRenaming(false);
  };

  const displayName = device.customName || device.name;
  const lastSeenText = formatDistanceToNow(device.lastSeen, { addSuffix: true });

  return (
    <Card className={`transition-all duration-300 ${device.connected ? 'border-windows-green' : 'border-gray-200 opacity-70'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {device.connected ? (
              <BluetoothConnected className="h-5 w-5 text-windows-blue" />
            ) : (
              <BluetoothOff className="h-5 w-5 text-gray-400" />
            )}
            <span className="font-medium text-sm text-gray-500">
              {device.id}
            </span>
          </div>
          <div className="flex items-center">
            {device.connected ? (
              <CircleCheck className="h-5 w-5 text-windows-green animate-pulse-slow" />
            ) : (
              <CircleX className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isRenaming ? (
          <div className="flex space-x-2">
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={device.name}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleSubmitRename}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsRenaming(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg mb-1 truncate">{displayName}</h3>
              {device.customName && (
                <p className="text-sm text-gray-500 truncate">({device.name})</p>
              )}
              <p className="text-sm text-gray-500">Last seen: {lastSeenText}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1 mb-1">
                {getBatteryIcon()}
                <span className="font-medium">
                  {device.batteryLevel !== null && device.batteryLevel !== undefined 
                    ? `${device.batteryLevel}%` 
                    : 'N/A'}
                </span>
              </div>
              <span className="text-sm text-gray-500 capitalize">{device.type || 'Unknown'}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {!isRenaming && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsRenaming(true)}
          >
            Rename
          </Button>
        )}
        <Button 
          variant={device.connected ? "destructive" : "default"}
          size="sm"
          className={device.connected ? "" : "bg-windows-blue"}
          onClick={() => onToggleConnection(device.id)}
        >
          {device.connected ? "Disconnect" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
