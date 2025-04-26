
import React from 'react';
import { BluetoothDevice } from '@/types/bluetooth';
import DeviceCard from './DeviceCard';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceListProps {
  devices: BluetoothDevice[];
  isLoading: boolean;
  onToggleConnection: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ 
  devices, 
  isLoading, 
  onToggleConnection,
  onRename 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-500">No Bluetooth devices found</h3>
        <p className="text-gray-400 mt-2">Please ensure your Bluetooth is turned on</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <DeviceCard 
          key={device.id} 
          device={device}
          onToggleConnection={onToggleConnection}
          onRename={onRename}
        />
      ))}
    </div>
  );
};

export default DeviceList;
