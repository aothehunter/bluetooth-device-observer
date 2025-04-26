
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { BluetoothDevice } from '@/types/bluetooth';
import { 
  initializeBluetooth,
  getConnectedDevices, 
  scanForDevices,
  toggleDeviceConnection,
  getBatteryLevel
} from '@/services/bluetoothService';
import Header from '@/components/Header';
import DeviceList from '@/components/DeviceList';
import StatusBar from '@/components/StatusBar';

const Index = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initBluetooth();
  }, []);

  const initBluetooth = async () => {
    try {
      await initializeBluetooth();
      await loadDevices();
    } catch (error) {
      toast({
        title: "Bluetooth Error",
        description: "Failed to initialize Bluetooth. Please ensure Bluetooth is enabled.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const connectedDevices = await getConnectedDevices();
      setDevices(connectedDevices);
      
      // Start scanning for new devices
      await scanForDevices((newDevice) => {
        setDevices(prev => {
          const exists = prev.some(d => d.id === newDevice.id);
          if (!exists) {
            return [...prev, newDevice];
          }
          return prev;
        });
      });
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
      title: "Scanning",
      description: "Scanning for Bluetooth devices...",
    });
    
    await loadDevices();
  };

  const handleToggleConnection = async (deviceId: string) => {
    try {
      const targetDevice = devices.find(d => d.id === deviceId);
      const action = targetDevice?.connected ? 'Disconnecting from' : 'Connecting to';
      
      toast({
        title: `${action} device...`,
        description: targetDevice?.customName || targetDevice?.name,
      });
      
      const isConnected = await toggleDeviceConnection(deviceId);
      
      // Update device list with new connection status
      setDevices(prev => prev.map(device => {
        if (device.id === deviceId) {
          return { ...device, connected: isConnected };
        }
        return device;
      }));

      // If connected, try to get battery level
      if (isConnected) {
        const batteryLevel = await getBatteryLevel(deviceId);
        setDevices(prev => prev.map(device => {
          if (device.id === deviceId) {
            return { ...device, batteryLevel };
          }
          return device;
        }));
      }
      
      const newStatus = isConnected ? 'Connected to' : 'Disconnected from';
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

  const handleRename = (deviceId: string, newName: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, customName: newName || undefined };
      }
      return device;
    }));
    
    toast({
      title: "Device renamed",
      description: `Device has been renamed to "${newName || 'default name'}"`,
    });
  };

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
