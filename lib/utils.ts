import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * SMART BILLING LOGIC:
 * Calculates the next valid billing date relative to today.
 * 
 * @param anchorDateStr - The start date or last known billing date.
 * @param cycle - 'monthly' | 'yearly' | 'weekly'
 * @param autoRenew - If false, we do not project forward (returns original date).
 */
export function calculateNextBillingDate(anchorDateStr: string, cycle: 'monthly' | 'yearly' | 'weekly', autoRenew: boolean): string {
  const anchor = new Date(anchorDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  // If auto_renew is off, the date is static (Expiry Date)
  if (!autoRenew) {
    return anchor.toISOString();
  }

  // If anchor is already in the future, return it
  if (anchor >= today) {
    return anchor.toISOString();
  }

  // Logic to project forward
  const nextDate = new Date(anchor);

  if (cycle === 'monthly') {
    // 1. Set nextDate to current month/year, keeping the original day
    nextDate.setFullYear(today.getFullYear());
    nextDate.setMonth(today.getMonth());

    // 2. Handle edge cases (e.g. Anchor is Jan 31, Today is Feb).
    // If setting to Feb 31 overflows to Mar, we correct it to last day of month.
    const originalDay = anchor.getDate();
    if (nextDate.getDate() !== originalDay) {
        // We overflowed. Set to last day of previous month (which is the intended month)
        nextDate.setDate(0); 
    }

    // 3. If this projected date is in the past (e.g. Today is 15th, Bill is 5th), add 1 month
    if (nextDate < today) {
       nextDate.setMonth(nextDate.getMonth() + 1);
       // Re-check day overflow for the NEW month
       const testDate = new Date(nextDate);
       // Try setting original day
       testDate.setDate(originalDay);
       // If month changed, it means we overflowed again.
       if (testDate.getMonth() !== nextDate.getMonth()) {
           nextDate.setDate(0); // Set to last day of this new month
       } else {
           nextDate.setDate(originalDay);
       }
    }
  } 
  else if (cycle === 'yearly') {
    nextDate.setFullYear(today.getFullYear());
    if (nextDate < today) {
      nextDate.setFullYear(today.getFullYear() + 1);
    }
  } 
  else if (cycle === 'weekly') {
    // Calculate difference in weeks and add
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const diff = today.getTime() - anchor.getTime();
    const weeksPassed = Math.ceil(diff / oneWeek);
    // Add weeks until it's in future
    nextDate.setTime(anchor.getTime() + (weeksPassed * oneWeek));
    // Double check just in case rounding made it yesterday
    if(nextDate < today) {
        nextDate.setTime(nextDate.getTime() + oneWeek);
    }
  }

  return nextDate.toISOString();
}

export function getDaysRemaining(nextBillingDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize
  const next = new Date(nextBillingDate);
  next.setHours(0, 0, 0, 0); // Normalize

  const diffTime = next.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number, currency: string) {
  // Handle specific locale for INR to get proper comma placement (e.g., 1,00,000)
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getUrgencyLevel(days: number): 'critical' | 'warning' | 'safe' {
  if (days < 0) return 'critical'; // Overdue
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'safe';
}

// Mock Exchange Rates (Base USD) - roughly updated
const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50 
};

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  // Convert to USD first, then to target
  const amountInUSD = amount / RATES[from]; 
  return amountInUSD * RATES[to];
}

export function getMonthlyCostInBase(amount: number, currency: Currency, cycle: 'monthly' | 'yearly' | 'weekly', baseCurrency: Currency = 'USD'): number {
  let monthlyAmount = amount;
  if (cycle === 'yearly') {
    monthlyAmount = amount / 12;
  } else if (cycle === 'weekly') {
    monthlyAmount = (amount * 52) / 12;
  }
  return convertCurrency(monthlyAmount, currency, baseCurrency);
}