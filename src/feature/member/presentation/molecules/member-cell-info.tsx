import React from 'react';
import { Avatar } from '@/shared/atoms/avatar';

export interface MemberCellInfoProps {
  name: string;
  email: string;
  avatarBgColor?: string;
}

export const MemberCellInfo: React.FC<MemberCellInfoProps> = ({
  name,
  email,
  avatarBgColor,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} bgColor={avatarBgColor} />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-slate-900 truncate">{name}</span>
        <span className="text-xs text-slate-500 truncate">{email}</span>
      </div>
    </div>
  );
};
