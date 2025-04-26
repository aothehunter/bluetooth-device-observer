
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { BluetoothDevice } from '@/types/bluetooth';
import { 
  getConnectedDevices, 
  toggleDeviceConnection, 
  renameDevice,
  refreshDeviceBatteryLevels 
} from '@/services/bluetoothService';
import Header from '@/components/Header';
import DeviceList from '@/components/DeviceList';
import StatusBar from '@/components/StatusBar';

const Index = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const fetchedDevices = await getConnectedDevices();
      setDevices(fetchedDevices);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load devices. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    toast({
      title: "Refreshing",
      description: "Scanning for devices...",
    });
    
    try {
      const updatedDevices = await refreshDeviceBatteryLevels();
      setDevices(updatedDevices);
      
      toast({
        title: "Refresh complete",
        description: `Found ${updatedDevices.length} devices.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh devices.",
        variant: "destructive"
      });
    }
  };

  const handleToggleConnection = async (deviceId: string) => {
    try {
      const targetDevice = devices.find(d => d.id === deviceId);
      const action = targetDevice?.connected ? 'Disconnecting from' : 'Connecting to';
      
      toast({
        title: `${action} device...`,
        description: targetDevice?.customName || targetDevice?.name,
      });
      
      const updatedDevices = await toggleDeviceConnection(deviceId);
      setDevices(updatedDevices);
      
      const newStatus = updatedDevices.find(d => d.id === deviceId)?.connected 
        ? 'Connected to' 
        : 'Disconnected from';
      
      toast({
        title: `${newStatus} device`,
        description: targetDevice?.customName || targetDevice?.name,
        variant: newStatus === 'Connected to' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to change connection state.",
        variant: "destructive"
      });
    }
  };

  const handleRename = async (deviceId: string, newName: string) => {
    try {
      const updatedDevices = await renameDevice(deviceId, newName);
      setDevices(updatedDevices);
      
      toast({
        title: "Device renamed",
        description: `Device has been renamed to "${newName || 'default name'}"`,
      });
    } catch (error) {
      toast({
        title: "Rename Error",
        description: "Failed to rename device.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadDevices();
    // In a real app, we'd set up event listeners for Bluetooth state changes here
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-windows-lightGray">
      <Header onRefresh={handleRefresh} isLoading={isLoading} />
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-windows-text mb-1">
            Bluetooth Devices
          </h2>
          <p className="text-gray-500">
            View and manage your connected Bluetooth devices
          </p>
        </div>
        
        <DeviceList 
          devices={devices} 
          isLoading={isLoading} 
          onToggleConnection={handleToggleConnection}
          onRename={handleRename}
        />
      </main>
      
      <StatusBar devices={devices} className="sticky bottom-0 shadow-md" />
    </div>
  );
};

export default Index;
