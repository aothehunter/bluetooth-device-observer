
export interface BluetoothDevice {
  id: string;
  name: string;
  customName?: string;
  connected: boolean;
  batteryLevel?: number | null;
  lastSeen: Date;
  type?: DeviceType;
}

export type DeviceType = 'headphones' | 'speaker' | 'keyboard' | 'mouse' | 'gamepad' | 'other';
