import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  reserved: 'bg-amber-50 text-amber-700 border-amber-200',
  sold: 'bg-gray-100 text-gray-600 border-gray-200',
  complete: 'bg-blue-50 text-blue-700 border-blue-200',
  partial: 'bg-orange-50 text-orange-700 border-orange-200',
  stored: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  checked_out: 'bg-gray-100 text-gray-600 border-gray-200',
  pending_pickup: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  used_excellent: 'bg-blue-50 text-blue-700 border-blue-200',
  used_good: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  used_fair: 'bg-amber-50 text-amber-700 border-amber-200',
  used_poor: 'bg-red-50 text-red-600 border-red-200',
  summer: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  winter: 'bg-blue-50 text-blue-700 border-blue-200',
  all_season: 'bg-green-50 text-green-700 border-green-200',
  ms: 'bg-purple-50 text-purple-700 border-purple-200',
  occupied: 'bg-red-50 text-red-600 border-red-200',
  vacant: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({ status, label, className }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border px-2.5 py-0.5",
        style,
        className
      )}
    >
      {label || status}
    </Badge>
  );
}
