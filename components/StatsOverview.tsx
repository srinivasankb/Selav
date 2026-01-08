import React from 'react';
import { Subscription, Currency } from '../types';
import { formatCurrency, getDaysRemaining, getMonthlyCostInBase } from '../lib/utils';
import { Icons } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Card, CardContent, Typography, useTheme, LinearProgress } from '@mui/material';

interface Props {
  subscriptions: Subscription[];
  baseCurrency?: Currency;
}

export const StatsOverview: React.FC<Props> = ({ subscriptions, baseCurrency = 'INR' }) => {
  const theme = useTheme();
  
  // 1. Calculate Statistics
  // Active Subs = Not trial AND Auto Renew is ON
  const activeSubs = subscriptions.filter(s => !s.is_trial && s.auto_renew);
  const trialSubs = subscriptions.filter(s => s.is_trial && s.auto_renew);
  const expiringSubs = subscriptions.filter(s => !s.auto_renew);

  const currentMonthlyBurn = activeSubs.reduce((acc, sub) => {
    return acc + getMonthlyCostInBase(sub.amount, sub.currency, sub.billing_cycle, baseCurrency as Currency);
  }, 0);

  const yearlyBurn = currentMonthlyBurn * 12;

  // 2. Prepare Category Data
  const categoryDataRaw: Record<string, number> = {};
  let maxCategoryValue = 0;

  activeSubs.forEach(sub => {
    const cost = getMonthlyCostInBase(sub.amount, sub.currency, sub.billing_cycle, baseCurrency as Currency);
    if (categoryDataRaw[sub.category]) {
      categoryDataRaw[sub.category] += cost;
    } else {
      categoryDataRaw[sub.category] = cost;
    }
    if (categoryDataRaw[sub.category] > maxCategoryValue) maxCategoryValue = categoryDataRaw[sub.category];
  });

  const categoryData = Object.keys(categoryDataRaw).map(cat => ({
    name: cat,
    value: categoryDataRaw[cat],
    percentage: currentMonthlyBurn > 0 ? (categoryDataRaw[cat] / currentMonthlyBurn) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Colors for Charts
  const COLORS = ['#f43f5e', '#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#64748b', '#e11d48', '#d946ef'];

  const StatCard = ({ title, value, subtitle, gradient, icon: Icon }: any) => (
    <div className={`rounded-3xl p-6 text-white shadow-soft relative overflow-hidden ${gradient}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <Icon size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
            <div className="text-sm opacity-80 font-medium">{subtitle}</div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
            title="Monthly Burn" 
            value={formatCurrency(currentMonthlyBurn, baseCurrency)} 
            subtitle="Recurring Expenses"
            gradient="bg-gradient-to-br from-slate-800 to-slate-900"
            icon={Icons.Zap}
        />
        <StatCard 
            title="Yearly Projection" 
            value={formatCurrency(yearlyBurn, baseCurrency)} 
            subtitle={`Across ${activeSubs.length} active services`}
            gradient="bg-gradient-to-br from-rose-500 to-orange-600"
            icon={Icons.Calendar}
        />
      </div>

      {/* Category Breakdown */}
      {currentMonthlyBurn > 0 && (
          <Card sx={{ borderRadius: 6, boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Spend Distribution</Typography>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Pie Chart */}
                    <div className="h-[220px] w-full md:w-1/2 flex justify-center items-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={5}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <ReTooltip 
                                    formatter={(value: number) => formatCurrency(value, baseCurrency)}
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xs text-slate-400 font-bold uppercase">Total</span>
                            <span className="text-lg font-bold text-slate-800">{formatCurrency(currentMonthlyBurn, baseCurrency)}</span>
                        </div>
                    </div>

                    {/* List Breakdown */}
                    <div className="flex-1 space-y-4">
                        {categoryData.map((cat, index) => (
                            <div key={cat.name} className="flex flex-col gap-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        {cat.name}
                                    </span>
                                    <span className="text-slate-600 font-medium">{formatCurrency(cat.value, baseCurrency)}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
          </Card>
      )}

      {/* Trials Insight */}
      {trialSubs.length > 0 && (
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
               <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                  <Icons.Warning size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-1">Potential Charges Ahead</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                      You have <strong>{trialSubs.length} active trials</strong>. If they renew, your monthly burn will increase by 
                      <span className="font-bold ml-1">{formatCurrency(trialSubs.reduce((acc, s) => acc + getMonthlyCostInBase(s.amount, s.currency, s.billing_cycle, baseCurrency as Currency), 0), baseCurrency)}</span>.
                  </p>
               </div>
          </div>
      )}

      {/* Expiring Insight */}
      {expiringSubs.length > 0 && (
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex items-start gap-4">
               <div className="bg-slate-200 p-3 rounded-full text-slate-600">
                  <Icons.Calendar size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Expiring Soon</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                      You have <strong>{expiringSubs.length} items</strong> set to end without renewal. These are excluded from your monthly burn calculation.
                  </p>
               </div>
          </div>
      )}
    </div>
  );
};