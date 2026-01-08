export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

// Simplified Categories
export type Category = 'Entertainment' | 'Bills' | 'Work' | 'Lifestyle' | 'Other';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  next_billing: string; // ISO date string
  auto_renew: boolean; 
  is_trial: boolean;
  category: Category;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currency?: Currency;
  vault_check?: string; // SHA256 hash of the derived key
  monthly_income_enc?: string; // Encrypted income string
}

export type SubFilter = 'all' | 'trial' | 'active';

export type SortOption = 'Name' | 'Price' | 'Date' | 'Type';