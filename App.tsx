import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    getCurrentUser, 
    updateUser, 
    deleteUser, 
    getSubscriptions, 
    createSubscription, 
    updateSubscription, 
    deleteSubscription, 
    logout,
    pb 
} from './services/pocketbase';
import { Subscription, SortOption, User } from './types';
import { Layout } from './components/Layout';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionEditor } from './components/SubscriptionEditor';
import { ProfileView } from './components/ProfileView';
import { VaultLock } from './components/VaultLock';
import { Icons } from './components/Icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getMonthlyCostInBase, formatCurrency, calculateNextBillingDate } from './lib/utils';
import { encryptData, decryptData, prepareEncryptedPayload } from './lib/crypto';
import { Menu, MenuItem, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f43f5e',
    },
    background: {
      default: '#f8fafc',
    }
  },
  typography: {
    fontFamily: '"Inter", "sans-serif"',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        }
      }
    }
  }
});

function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('all');
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortBy, setSortBy] = useState<SortOption>('Type');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  
  // Income State (Decrypted from DB)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  // View State for Header Card
  const [burnView, setBurnView] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync User State with PocketBase AuthStore
  useEffect(() => {
    const unsub = pb.authStore.onChange((token, model) => {
        setUser(model as unknown as User | null);
        if (!model) {
            // If logged out externally, lock vault
            setIsVaultUnlocked(false);
        }
    }, true); // true = fire immediately

    return () => {
        unsub();
    };
  }, []);

  // Load Data on Vault Unlock
  useEffect(() => {
    if (user && isVaultUnlocked) {
        loadSecureData();
    }
  }, [user, isVaultUnlocked]);

  const loadSecureData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
          // 1. Decrypt Income from User Profile
          // Note: user.monthly_income_enc comes from DB
          // We need to fetch the latest user object to ensure we have it
          const freshUser = getCurrentUser(); // Or fetch specific fields if needed
          if (freshUser && freshUser.monthly_income_enc) {
               const dec = decryptData(freshUser.monthly_income_enc);
               setMonthlyIncome(dec ? parseFloat(dec) : 0);
          }

          // 2. Fetch and Decrypt Subscriptions
          const records = await getSubscriptions(user.id);
          const decryptedSubs = records.map((rec: any) => {
              const name = decryptData(rec.name);
              const amountStr = decryptData(rec.amount);
              return {
                  ...rec,
                  name: name || 'Locked Data',
                  amount: amountStr ? parseFloat(amountStr) : 0,
                  // Ensure numeric conversions if DB returns strings for other fields
                  currency: rec.currency,
                  billing_cycle: rec.billing_cycle,
                  next_billing: rec.next_billing,
                  auto_renew: rec.auto_renew,
                  is_trial: rec.is_trial,
                  category: rec.category
              } as Subscription;
          });
          setSubscriptions(decryptedSubs);

      } catch (e) {
          console.error("Failed to load secure data", e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleVaultSetup = async (vaultCheck: string) => {
      if (!user) return;
      try {
          await updateUser(user.id, { vault_check: vaultCheck });
          // Update local user state
          const updatedUser = { ...user, vault_check: vaultCheck };
          setUser(updatedUser);
          setIsVaultUnlocked(true);
      } catch (e) {
          console.error("Failed to setup vault", e);
          alert("Failed to save security PIN. Please check your connection.");
      }
  };

  const handleIncomeChange = async (amount: number) => {
      if (!user) return;
      setMonthlyIncome(amount);
      const encrypted = encryptData(amount);
      try {
          await updateUser(user.id, { monthly_income_enc: encrypted });
          // Update local user object gently
          setUser(prev => prev ? ({...prev, monthly_income_enc: encrypted}) : null);
      } catch (e) {
          console.error("Failed to save income", e);
      }
  };

  const handleSaveSubscription = async (data: any) => {
    if (!user) return;

    try {
        // 1. Prepare Encrypted Payload
        // name and amount are encrypted strings
        const securePayload = prepareEncryptedPayload(data);
        
        if (editingSub) {
            await updateSubscription(editingSub.id, securePayload);
            // Optimistic Update
            setSubscriptions(prev => prev.map(s => s.id === editingSub.id ? { ...s, ...data } : s));
        } else {
            const newRecord = await createSubscription(securePayload);
            // We need to add the unencrypted data to state for display
            // The ID comes from the server response
            const newSub: Subscription = {
                ...newRecord, // has id, created, etc
                ...data, // has decrypted name, amount
                id: newRecord.id
            };
            setSubscriptions(prev => [newSub, ...prev]);
        }
        setEditingSub(null);
    } catch(e) {
        console.error("Failed to save subscription", e);
        alert("Error saving data. Please ensure you are online.");
    }
  };

  const handleOpenAdd = () => {
      setEditingSub(null);
      setIsEditorOpen(true);
  }

  const handleOpenEdit = useCallback((sub: Subscription) => {
      setEditingSub(sub);
      setIsEditorOpen(true);
  }, []);

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this subscription?")) return;
    try {
        await deleteSubscription(id);
        setSubscriptions(prev => prev.filter(s => s.id !== id));
        setEditingSub(null);
        setIsEditorOpen(false);
    } catch (e) {
        console.error("Failed to delete", e);
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
      if (!user) return;
      try {
          await updateUser(user.id, data);
          setUser(prev => prev ? ({ ...prev, ...data }) : null);
      } catch (e) {
          console.error("Failed to update profile", e);
      }
  };

  const handleDeleteAccount = async () => {
      if (!user) return;
      try {
          await deleteUser(user.id);
          logout();
          setUser(null);
          setIsVaultUnlocked(false);
          // Clear hash and reload to return to landing
          window.location.hash = '';
          window.location.reload();
      } catch (e) {
          console.error("Failed to delete account", e);
      }
  };

  const handleLogout = () => {
      logout();
      setUser(null);
      setIsVaultUnlocked(false);
      // Clear hash and reload to return to landing
      window.location.hash = '';
      window.location.reload();
  };

  // Sorting and Filtering Logic
  const sortedSubscriptions = useMemo(() => {
    let sorted = [...subscriptions];
    
    const getSortDate = (s: Subscription) => {
        return new Date(calculateNextBillingDate(s.next_billing, s.billing_cycle, s.auto_renew)).getTime();
    };

    if (activeTab === 'upcoming') {
        return sorted
            .filter(s => s.auto_renew || getSortDate(s) >= new Date().setHours(0,0,0,0)) 
            .sort((a, b) => getSortDate(a) - getSortDate(b));
    }
    
    switch (sortBy) {
        case 'Price':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'Name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'Date':
            return sorted.sort((a, b) => getSortDate(a) - getSortDate(b));
        case 'Type':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        default:
            return sorted;
    }
  }, [subscriptions, sortBy, activeTab]);

  const totalMonthlyCost = useMemo(() => {
    return subscriptions.reduce((acc, sub) => {
        if(sub.is_trial || !sub.auto_renew) return acc;
        return acc + getMonthlyCostInBase(sub.amount, sub.currency, sub.billing_cycle, 'INR');
    }, 0);
  }, [subscriptions]);

  const totalImpactPercent = monthlyIncome > 0 ? (totalMonthlyCost / monthlyIncome) * 100 : 0;

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = (option?: SortOption) => {
    setSortAnchorEl(null);
    if (option) setSortBy(option);
  };

  const groupByCategory = (subs: Subscription[]) => {
    const groups: Record<string, Subscription[]> = {};
    subs.forEach(sub => {
        const cat = sub.category || 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(sub);
    });
    return groups;
  };

  if (!user) {
      // Logic handled in index.tsx router, but safe fallback
      return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* Vault Lock Overlay */}
      {!isVaultUnlocked && (
          <VaultLock 
            user={user} 
            onUnlock={() => setIsVaultUnlocked(true)} 
            onSetup={handleVaultSetup} 
          />
      )}

      <Layout 
        user={user}
        onAddClick={handleOpenAdd}
        onProfileClick={() => setCurrentView('profile')}
        showAddButton={currentView === 'dashboard'}
      >
        {currentView === 'profile' ? (
            <ProfileView 
                user={user} 
                onUpdateUser={handleUpdateProfile} 
                onDeleteAccount={handleDeleteAccount}
                onBack={() => setCurrentView('dashboard')}
                monthlyIncome={monthlyIncome}
                onIncomeChange={handleIncomeChange}
                onLogout={handleLogout}
            />
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Header Card Summary */}
                <div 
                    onClick={() => setBurnView(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-soft mb-6 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-glow"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-6">
                            <div className="flex flex-col order-2 md:order-1">
                                <h2 className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                                    {burnView === 'monthly' ? 'Monthly Burn' : 'Yearly Projection'}
                                    <Icons.RefreshCw size={12} className={burnView === 'monthly' ? "text-slate-600" : "text-rose-400"} />
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                                        {formatCurrency(burnView === 'monthly' ? totalMonthlyCost : totalMonthlyCost * 12, 'INR').replace('.00', '')}
                                    </span>
                                    <span className="text-xl text-slate-500 font-medium">/{burnView === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 flex self-start md:self-auto order-1 md:order-2 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                                <button 
                                onClick={() => setActiveTab('upcoming')}
                                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                >
                                Upcoming
                                </button>
                                <button 
                                onClick={() => setActiveTab('all')}
                                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                >
                                All
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            {monthlyIncome > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Impact</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-rose-400 font-bold text-lg">{totalImpactPercent.toFixed(1)}%</span>
                                        <span className="text-slate-500 text-xs">of income</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex-1 text-right">
                                <p className="text-xs text-slate-500 italic">Tap card to toggle yearly view</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sort Bar */}
                {activeTab === 'all' && subscriptions.length > 0 && (
                    <div className="flex justify-between items-center px-2 mb-4">
                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{subscriptions.length} Items</span>
                        <Button 
                            endIcon={<Icons.ChevronRight size={16} className="rotate-90" />} 
                            onClick={handleSortClick}
                            className="text-slate-600 font-semibold"
                            size="small"
                        >
                            Sort by: {sortBy}
                        </Button>
                        <Menu
                            anchorEl={sortAnchorEl}
                            open={Boolean(sortAnchorEl)}
                            onClose={() => handleSortClose()}
                            PaperProps={{ sx: { borderRadius: 3, mt: 1 } }}
                        >
                            <MenuItem onClick={() => handleSortClose('Type')}>Type</MenuItem>
                            <MenuItem onClick={() => handleSortClose('Price')}>Price</MenuItem>
                            <MenuItem onClick={() => handleSortClose('Name')}>Name</MenuItem>
                            <MenuItem onClick={() => handleSortClose('Date')}>Billing Date</MenuItem>
                        </Menu>
                    </div>
                )}

                {/* List View */}
                <div className="space-y-6 pb-20">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
                                <Icons.Bills size={40} className="text-slate-400" />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center border-4 border-white">
                                    <Icons.Add size={20} className="text-brand-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No subscriptions yet</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed">
                                Add your first subscription to start tracking expenses, upcoming bills, and free trials.
                            </p>
                            <button 
                                onClick={handleOpenAdd}
                                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Icons.Add size={20} />
                                Add Subscription
                            </button>
                        </div>
                    ) : (
                        activeTab === 'upcoming' ? (
                            <div className="space-y-3">
                                {sortedSubscriptions.length === 0 && (
                                     <div className="text-center py-10 opacity-60">
                                        <p className="text-slate-500 text-sm">No upcoming payments soon.</p>
                                     </div>
                                )}
                                {sortedSubscriptions.map(sub => (
                                    <SubscriptionCard 
                                        key={sub.id} 
                                        sub={sub} 
                                        onClick={handleOpenEdit}
                                        monthlyIncome={monthlyIncome}
                                    />
                                ))}
                            </div>
                        ) : (
                            sortBy === 'Type' ? (
                            Object.entries(groupByCategory(sortedSubscriptions)).map(([category, subs]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                                        {category} <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-[10px]">{subs.length}</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {subs.map(sub => (
                                            <SubscriptionCard 
                                                key={sub.id} 
                                                sub={sub} 
                                                onClick={handleOpenEdit}
                                                monthlyIncome={monthlyIncome}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                            ) : (
                                <div className="space-y-3">
                                {sortedSubscriptions.map(sub => (
                                    <SubscriptionCard 
                                        key={sub.id} 
                                        sub={sub} 
                                        onClick={handleOpenEdit}
                                        monthlyIncome={monthlyIncome}
                                    />
                                ))}
                            </div>
                            )
                        )
                    )}
                </div>
            </div>
        )}

        <SubscriptionEditor
          isOpen={isEditorOpen} 
          onClose={() => { setIsEditorOpen(false); setEditingSub(null); }}
          onSave={handleSaveSubscription}
          onDelete={editingSub ? handleDelete : undefined}
          initialData={editingSub}
          isMobile={isMobile}
          defaultCurrency={user.currency || 'INR'}
        />

      </Layout>
    </ThemeProvider>
  );
}

export default App;