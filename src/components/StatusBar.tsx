
import React from 'react';
import { BluetoothDevice } from '@/types/bluetooth';
import { Progress } from '@/components/ui/progress';

interface StatusBarProps {
  devices: BluetoothDevice[];
  className?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ devices, className = '' }) => {
  const connectedCount = devices.filter(d => d.connected).length;
  const totalCount = devices.length;
  const percent = totalCount > 0 ? (connectedCount / totalCount) * 100 : 0;

  return (
    <div className={`bg-white p-4 border-t ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{connectedCount}</span> of <span className="font-medium">{totalCount}</span> devices connected
            </div>
            <div className="w-32 hidden md:block">
              <Progress value={percent} className="h-2" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-windows-green mr-2"></div>
              <span className="text-xs text-gray-600">Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-xs text-gray-600">Disconnected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
