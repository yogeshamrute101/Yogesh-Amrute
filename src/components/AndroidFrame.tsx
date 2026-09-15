import React, { ReactNode } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: ReactNode;
  isDeviceMode: boolean;
  onToggleDeviceMode: () => void;
  projectName: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isDeviceMode,
  onToggleDeviceMode,
  projectName,
}) => {
  if (!isDeviceMode) {
    return (
      <div id="vidoai-edge-to-edge-container" className="relative w-full h-full flex flex-col bg-[#0b0c10] text-[#e5e7eb] overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div id="android-device-outer-wrapper" className="relative w-full h-full flex flex-col items-center justify-center p-0 md:p-2 bg-[#07080b] select-none overflow-hidden">
      {/* Mobile edge-to-edge container, desktop framed */}
      <div
        id="android-device-chassis"
        className="relative w-full h-full md:max-w-[480px] md:h-[96vh] md:max-h-[920px] bg-[#0d0f17] md:rounded-[36px] md:p-[6px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden md:border-[2px] md:border-[#2a2c38]"
      >
        <div className="relative w-full h-full bg-[#0b0c13] md:rounded-[30px] overflow-hidden flex flex-col">
          {/* Main Content */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
