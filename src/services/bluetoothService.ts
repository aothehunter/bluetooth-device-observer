
import { BluetoothDevice } from "../types/bluetooth";

// Mock data for Bluetooth devices since we can't access real Bluetooth API in the browser
const mockDevices: BluetoothDevice[] = [
  {
    id: "00:11:22:33:44:55",
    name: "Sony WH-1000XM4",
    connected: true,
    batteryLevel: 75,
    lastSeen: new Date(),
    type: "headphones",
  },
  {
    id: "AA:BB:CC:DD:EE:FF",
    name: "Magic Mouse",
    connected: true,
    batteryLevel: 45,
    lastSeen: new Date(),
    type: "mouse",
  },
  {
    id: "11:22:33:44:55:66",
    name: "JBL Flip 5",
    connected: false,
    batteryLevel: 88,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    type: "speaker",
  },
  {
    id: "BB:CC:DD:EE:FF:00",
    name: "Xbox Controller",
    connected: true,
    batteryLevel: 12,
    lastSeen: new Date(),
    type: "gamepad",
  },
  {
    id: "CC:DD:EE:FF:00:11",
    name: "Unknown Device",
    connected: false,
    batteryLevel: null,
    lastSeen: new Date(Date.now() - 86400000), // 1 day ago
    type: "other",
  }
];

// Simulate loading devices
export const getConnectedDevices = (): Promise<BluetoothDevice[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([...mockDevices]);
    }, 1000);
  });
};

// Simulate toggling connection
export const toggleDeviceConnection = (deviceId: string): Promise<BluetoothDevice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedDevices = mockDevices.map(device => {
        if (device.id === deviceId) {
          return {
            ...device,
            connected: !device.connected,
            lastSeen: new Date()
          };
        }
        return device;
      });
      
      resolve([...updatedDevices]);
    }, 500);
  });
};

// Simulate renaming a device
export const renameDevice = (deviceId: string, customName: string): Promise<BluetoothDevice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedDevices = mockDevices.map(device => {
        if (device.id === deviceId) {
          return {
            ...device,
            customName: customName.trim() ? customName : undefined
          };
        }
        return device;
      });
      
      resolve([...updatedDevices]);
    }, 300);
  });
};

// Simulate refreshing battery levels
export const refreshDeviceBatteryLevels = (): Promise<BluetoothDevice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedDevices = mockDevices.map(device => {
        if (device.connected && device.batteryLevel !== null) {
          // Simulate slight battery drain
          const newLevel = Math.max(0, (device.batteryLevel || 0) - Math.floor(Math.random() * 5));
          return {
            ...device,
            batteryLevel: newLevel
          };
        }
        return device;
      });
      
      resolve([...updatedDevices]);
    }, 700);
  });
};
