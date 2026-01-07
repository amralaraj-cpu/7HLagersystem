import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, className }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
              <Icon className={cn('w-6 h-6', iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
