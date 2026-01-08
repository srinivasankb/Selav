import React, { useState } from 'react';
import { Icons } from './Icons';
import { Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, InputAdornment, Select, MenuItem, Chip, Alert, Snackbar, Avatar } from '@mui/material';
import { User, Currency } from '../types';
import { ChangePinDialog } from './ChangePinDialog';
import { pb } from '../services/pocketbase';

interface Props {
    user: User;
    onUpdateUser: (updatedData: Partial<User>) => void;
    onDeleteAccount: () => void;
    onBack: () => void;
    monthlyIncome: number;
    onIncomeChange: (amount: number) => void;
    onLogout: () => void;
}

const CURRENCIES: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

export const ProfileView: React.FC<Props> = ({ user, onUpdateUser, onDeleteAccount, onBack, monthlyIncome, onIncomeChange, onLogout }) => {
    const [name, setName] = useState(user.name || '');
    const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
    
    // Controlled Accordion State
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleSaveName = () => {
        onUpdateUser({ name });
    };

    const handleDelete = () => {
        if (window.confirm("CRITICAL WARNING: This will permanently delete your account and ALL your subscription data. This action cannot be undone. Are you absolutely sure?")) {
            onDeleteAccount();
        }
    };

     const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        onIncomeChange(isNaN(val) ? 0 : val);
    };

    const avatarUrl = user?.avatar ? pb.files.getUrl(user, user.avatar) : undefined;

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
                    <Icons.ChevronRight className="rotate-180" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
            </div>

            <div className="space-y-8 pb-10">
                {/* Profile Section */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar 
                            src={avatarUrl}
                            alt={user?.name || user?.email}
                            sx={{ width: 64, height: 64, bgcolor: 'var(--brand-100)', color: 'var(--brand-600)', fontSize: '1.5rem', fontWeight: 'bold' }}
                        >
                            {!avatarUrl && (user?.email?.[0].toUpperCase() || 'U')}
                        </Avatar>
                        <div>
                            <div className="font-bold text-lg text-slate-900">{user.email}</div>
                            <div className="text-slate-500 text-sm">Free Account</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <TextField 
                            label="Display Name" 
                            fullWidth 
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{ sx: { borderRadius: 3 } }}
                        />
                        <Button 
                            variant="contained" 
                            disableElevation 
                            onClick={handleSaveName}
                            disabled={name === user.name}
                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Update Profile
                        </Button>
                    </div>
                </section>

                 {/* Financial Settings */}
                 <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3 px-1">Financial Settings</h2>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                        <div>
                            <Typography variant="body2" fontWeight="bold" className="text-slate-800 mb-1">
                                Monthly Income (Encrypted)
                            </Typography>
                             <Typography variant="caption" className="text-slate-400 mb-3 block">
                                Used to calculate the % impact of your subscriptions.
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                type="number"
                                placeholder="0"
                                value={monthlyIncome || ''}
                                onChange={handleIncomeChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    sx: { 
                                        borderRadius: 3,
                                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "& input[type=number]": {
                                            "-moz-appearance": "textfield",
                                        },
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <Typography variant="body2" fontWeight="bold" className="text-slate-800 mb-1">
                                Default Currency
                            </Typography>
                             <Typography variant="caption" className="text-slate-400 mb-3 block">
                                This currency will be selected by default when adding new subscriptions.
                            </Typography>
                            <Select
                                fullWidth
                                value={user.currency || 'INR'}
                                onChange={(e) => onUpdateUser({ currency: e.target.value as Currency })}
                                sx={{ borderRadius: 3 }}
                            >
                                {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </div>
                    </div>
                </section>

                {/* Security Info */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3 px-1">Security</h2>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                         <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <Icons.ShieldCheck className="text-indigo-600 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                                <Typography variant="subtitle2" className="text-indigo-800 font-bold">Secure Vault Active</Typography>
                                <Typography variant="caption" className="text-indigo-700 leading-tight block mb-2">
                                    Your data is encrypted using a key derived from your 4-digit PIN. We do not store your PIN.
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                            <Icons.ShieldAlert className="text-rose-600 mt-0.5 flex-shrink-0" size={20} />
                            <div>
                                <Typography variant="subtitle2" className="text-rose-800 font-bold">Warning: Lost PIN = Lost Data</Typography>
                                <Typography variant="caption" className="text-rose-700 leading-tight block">
                                    Because your data is encrypted, <strong>it cannot be restored if you forget your PIN</strong>. The server does not have a copy of your key.
                                </Typography>
                            </div>
                        </div>

                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            fullWidth
                            startIcon={<Icons.Lock size={16} />}
                            onClick={() => setIsPinDialogOpen(true)}
                            sx={{ borderRadius: 3, textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}
                        >
                            Change Security PIN
                        </Button>
                    </div>
                </section>

                {/* Help Section */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-3 px-1">Help & Guide</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <Accordion 
                            expanded={expanded === 'panel1'} 
                            onChange={handleAccordionChange('panel1')}
                            elevation={0} 
                            sx={{ '&:before': { display: 'none' } }} 
                            disableGutters
                        >
                            <AccordionSummary expandIcon={<Icons.ChevronRight size={20} />} sx={{ px: 3 }}>
                                <Typography fontWeight={600} fontSize="0.95rem">How does "Days Remaining" work?</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography variant="body2" color="text.secondary" className="leading-relaxed">
                                    We calculate the days left based on the "Next Billing Date" you set. If the subscription auto-renews, it shows days until the next charge. If it doesn't auto-renew, it counts down to the expiry date.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <div className="h-px bg-slate-50 mx-3" />
                         <Accordion 
                            expanded={expanded === 'panel2'} 
                            onChange={handleAccordionChange('panel2')}
                            elevation={0} 
                            sx={{ '&:before': { display: 'none' } }} 
                            disableGutters
                        >
                            <AccordionSummary expandIcon={<Icons.ChevronRight size={20} />} sx={{ px: 3 }}>
                                <Typography fontWeight={600} fontSize="0.95rem">What is "Monthly Burn"?</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography variant="body2" color="text.secondary" className="leading-relaxed">
                                    This is the total amount you spend on recurring subscriptions per month. Yearly subscriptions are divided by 12 to give you an accurate monthly average.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                         <div className="h-px bg-slate-50 mx-3" />
                        <Accordion 
                            expanded={expanded === 'panel3'} 
                            onChange={handleAccordionChange('panel3')}
                            elevation={0} 
                            sx={{ '&:before': { display: 'none' } }} 
                            disableGutters
                        >
                            <AccordionSummary expandIcon={<Icons.ChevronRight size={20} />} sx={{ px: 3 }}>
                                <Typography fontWeight={600} fontSize="0.95rem">Can I restore data without a PIN?</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                                <Typography variant="body2" color="text.secondary" className="leading-relaxed">
                                    No. For your security, data is encrypted on your device. If you lose your PIN, the encryption key is lost forever, making the data unreadable. You would need to reset your account and start over.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </section>

                {/* Account Actions */}
                <section className="space-y-4">
                     <h2 className="text-lg font-bold text-slate-900 mb-1 px-1">Account Actions</h2>
                     
                     <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div 
                            onClick={onLogout} 
                            className="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors text-slate-700"
                        >
                            <Icons.Logout size={20} />
                            <span className="font-medium">Sign Out</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div 
                            onClick={handleDelete}
                            className="p-4 flex items-center gap-3 cursor-pointer hover:bg-rose-50 transition-colors text-rose-600"
                        >
                            <Icons.Warning size={20} />
                            <span className="font-medium">Delete Account Data</span>
                        </div>
                     </div>
                </section>
            </div>

            <ChangePinDialog 
                open={isPinDialogOpen} 
                onClose={() => setIsPinDialogOpen(false)} 
                user={user} 
                onUpdateUser={onUpdateUser}
            />
        </div>
    );
};