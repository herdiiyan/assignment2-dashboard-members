import React from 'react';
import { Users, Activity, Building2, Clock } from 'lucide-react';
import { MetricCard } from '../molecules/metric-card';
import { MemberMetrics } from '../../domain/member.entities';

export interface MetricsGridProps {
  metrics: MemberMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Members"
        value={metrics.totalMembers}
        icon={<Users className="w-5 h-5" />}
        iconBgColor="bg-blue-50 text-blue-600"
        badgeText="+12% from last month"
        badgeColor="bg-blue-50 text-blue-700 border border-blue-200/50"
      />
      <MetricCard
        label="Active Now"
        value={metrics.activeNow}
        icon={<Activity className="w-5 h-5" />}
        iconBgColor="bg-blue-50 text-blue-600"
        badgeText={`${metrics.activePercentage}% live activity`}
        badgeColor="bg-blue-50 text-indigo-700 border border-blue-200/50"
      />
      <MetricCard
        label="Departments"
        value={metrics.departmentsCount}
        icon={<Building2 className="w-5 h-5" />}
        iconBgColor="bg-blue-50 text-slate-600"
        badgeText={`${metrics.departmentsCount} active units`}
        badgeColor="bg-blue-100 text-slate-600"
      />
      <MetricCard
        label="Pending Invites"
        value={metrics.pendingInvites}
        icon={<Clock className="w-5 h-5" />}
        iconBgColor="bg-blue-50 text-amber-600"
        badgeText={`${metrics.expiringSoon} expiring soon`}
        badgeColor="bg-blue-50 text-[#7e3000] border border-blue-200/50 font-semibold"
      />
    </div>
  );
};
