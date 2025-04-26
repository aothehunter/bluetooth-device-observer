
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bluetooth, RefreshCcw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading }) => {
  return (
    <header className="bg-windows-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Bluetooth className="mr-2 h-6 w-6" />
          <h1 className="text-2xl font-semibold">Bluetooth Device Monitor</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          disabled={isLoading}
          className="bg-transparent hover:bg-white/10 text-white border-white"
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Devices
        </Button>
      </div>
    </header>
  );
};

export default Header;
