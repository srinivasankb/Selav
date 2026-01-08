import React from 'react';
import { Subscription, Category } from '../types';
import { getDaysRemaining, getUrgencyLevel, formatCurrency, cn, getMonthlyCostInBase, calculateNextBillingDate } from '../lib/utils';
import { Icons } from './Icons';
import { Typography } from '@mui/material';

interface Props {
  sub: Subscription;
  onClick: (sub: Subscription) => void;
  monthlyIncome: number;
}

const CategoryIcons: Record<Category, any> = {
  Entertainment: Icons.Entertainment,
  Work: Icons.Work,
  Bills: Icons.Bills,
  Lifestyle: Icons.Lifestyle,
  Other: Icons.Other
};

const CategoryColors: Record<Category, string> = {
  Entertainment: 'bg-purple-500',
  Work: 'bg-blue-500',
  Bills: 'bg-emerald-500',
  Lifestyle: 'bg-orange-500',
  Other: 'bg-slate-500'
};

export const SubscriptionCard = React.memo<Props>(({ sub, onClick, monthlyIncome }) => {
  // Use Smart Calculation to find the *real* next date based on the recurring cycle
  const projectedDate = calculateNextBillingDate(sub.next_billing, sub.billing_cycle, sub.auto_renew);
  
  const days = getDaysRemaining(projectedDate);
  const urgency = getUrgencyLevel(days);
  
  // Calculate percentage impact
  const monthlyCost = getMonthlyCostInBase(sub.amount, sub.currency, sub.billing_cycle, 'INR');
  const percentageOfIncome = monthlyIncome > 0 ? (monthlyCost / monthlyIncome) * 100 : 0;

  const getUrgencyColor = () => {
    if (!sub.auto_renew) {
        // Legacy "Overdue" logic for non-renewing items
        if (days < 0) return 'text-slate-500 bg-slate-100 border-slate-200'; // Expired
        if (days === 0) return 'text-rose-600 bg-rose-50 border-rose-100'; // Ends Today
        return 'text-slate-500 bg-slate-100 border-slate-200';
    }

    if (sub.is_trial) return 'text-amber-600 bg-amber-50 border-amber-100';
    
    switch (urgency) {
      case 'critical': return 'text-rose-500 bg-rose-50 border-rose-100 animate-pulse';
      case 'warning': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100'; // Green for safe
    }
  };

  const getBadgeText = () => {
      if (!sub.auto_renew) {
          return days === 0 ? 'Ends Today' : days < 0 ? 'Ended' : `${days}d left`;
      }
      // For auto-renew, days should rarely be < 0 due to calculation, but handling 0 is important
      return days === 0 ? 'Due Today' : days === 1 ? 'Tomorrow' : `${days}d left`;
  };

  const IconComponent = CategoryIcons[sub.category] || Icons.Zap;

  return (
    <div 
        onClick={() => onClick(sub)}
        className={cn(
        "bg-white rounded-2xl p-4 shadow-sm border flex items-center justify-between group hover:shadow-md transition-all cursor-pointer active:scale-[0.99]",
        !sub.auto_renew ? "border-slate-100 bg-slate-50/50" : "border-slate-100"
    )}>
      {/* Left: Icon & Info */}
      <div className="flex items-center gap-4 overflow-hidden">
        <div className={cn(
            "w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-sm transition-opacity", 
            CategoryColors[sub.category] || 'bg-slate-500',
            !sub.auto_renew && "opacity-60 grayscale"
        )}>
            <IconComponent size={24} />
        </div>
        
        <div className="flex flex-col min-w-0">
            <Typography variant="body1" fontWeight={600} className={cn("text-slate-900 leading-tight truncate", !sub.auto_renew && "text-slate-500 line-through decoration-slate-300 decoration-2")}>
                {sub.name}
            </Typography>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                 <Typography variant="caption" className="text-slate-500 capitalize">
                    {sub.billing_cycle}
                </Typography>
                
                {/* Status Badge */}
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-bold border whitespace-nowrap transition-colors", getUrgencyColor())}>
                    {getBadgeText()}
                </span>
            </div>
        </div>
      </div>

      {/* Right: Price */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex items-center gap-2">
            <Typography variant="body1" fontWeight={600} className={cn("text-slate-900", !sub.auto_renew && "text-slate-400")}>
                {formatCurrency(sub.amount, sub.currency)}
            </Typography>
            <Icons.ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>

        {percentageOfIncome > 0 && sub.auto_renew && !sub.is_trial && (
             <Typography variant="caption" className="text-slate-400 font-medium text-[10px] mr-6">
                {percentageOfIncome < 0.1 ? '< 0.1%' : `${percentageOfIncome.toFixed(1)}%`}
            </Typography>
        )}
      </div>
    </div>
  );
});