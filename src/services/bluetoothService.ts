
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { BluetoothDevice, DeviceType } from '@/types/bluetooth';

const BATTERY_SERVICE = '180F';
const BATTERY_CHARACTERISTIC = '2A19';

export const initializeBluetooth = async () => {
  await BleClient.initialize();
};

export const getConnectedDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    const devices = await BleClient.getDevices();
    return devices.map(convertBleDeviceToBluetoothDevice);
  } catch (error) {
    console.error('Failed to get devices:', error);
    throw error;
  }
};

export const scanForDevices = async (
  onDeviceFound: (device: BluetoothDevice) => void
): Promise<void> => {
  try {
    await BleClient.requestLEScan(
      {
        services: [BATTERY_SERVICE],
      },
      (result) => {
        const device = convertBleDeviceToBluetoothDevice(result.device);
        onDeviceFound(device);
      }
    );

    // Stop scan after 5 seconds
    setTimeout(async () => {
      await BleClient.stopLEScan();
    }, 5000);
  } catch (error) {
    console.error('Failed to scan:', error);
    throw error;
  }
};

export const toggleDeviceConnection = async (deviceId: string): Promise<boolean> => {
  try {
    await BleClient.connect(deviceId);
    return true;
  } catch (error) {
    console.error('Failed to connect:', error);
    throw error;
  }
};

export const getBatteryLevel = async (deviceId: string): Promise<number | null> => {
  try {
    const result = await BleClient.read(
      deviceId,
      BATTERY_SERVICE,
      BATTERY_CHARACTERISTIC
    );
    return new DataView(result.buffer).getUint8(0);
  } catch (error) {
    console.error('Failed to get battery level:', error);
    return null;
  }
};

const convertBleDeviceToBluetoothDevice = (bleDevice: BleDevice): BluetoothDevice => {
  return {
    id: bleDevice.deviceId,
    name: bleDevice.name || 'Unknown Device',
    connected: false, // Will be updated when checking connection status
    lastSeen: new Date(),
    type: guessDeviceType(bleDevice.name || ''),
    batteryLevel: null // Will be updated when reading battery level
  };
};

const guessDeviceType = (name: string): DeviceType => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('headphone') || lowerName.includes('airpod') || lowerName.includes('earbud')) {
    return 'headphones';
  } else if (lowerName.includes('speaker')) {
    return 'speaker';
  } else if (lowerName.includes('keyboard')) {
    return 'keyboard';
  } else if (lowerName.includes('mouse')) {
    return 'mouse';
  } else if (lowerName.includes('controller') || lowerName.includes('gamepad')) {
    return 'gamepad';
  }
  return 'other';
};
