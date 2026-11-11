import React from 'react';
import { User } from 'lucide-react';

export interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Alex Vance',
  userRole = 'Lead Architect',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-[56px] bg-white/90 backdrop-blur-md border-b border-[#c7c4d8]/40 shadow-[0px_1px_2px_0px_rgba(15,23,42,0.03)] px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* User Icon Badge */}
        <div className="w-8 h-8 rounded-xl bg-[#3525cd] flex items-center justify-center text-white shadow-sm shrink-0">
          <User className="w-3.5 h-3.5" />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[#0b1c30] leading-tight">
            {userName}
          </span>
          <span className="text-[11px] font-semibold text-[#464555] leading-tight tracking-[0.22px]">
            {userRole}
          </span>
        </div>
      </div>
    </header>
  );
};
