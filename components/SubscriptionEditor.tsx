import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from './Icons';
import { Currency, Category, Subscription } from '../types';
import { 
  Dialog, 
  Button, 
  TextField, 
  FormControlLabel, 
  Switch, 
  Select, 
  MenuItem,
  Chip,
  Box,
  FormControl,
  Typography,
  IconButton,
  InputAdornment,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  initialData?: Subscription | null;
  isMobile: boolean;
  defaultCurrency: Currency;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PRESETS = [
  { name: 'Netflix', amount: 649, category: 'Entertainment', currency: 'INR' },
  { name: 'Spotify', amount: 119, category: 'Entertainment', currency: 'INR' },
  { name: 'JioFiber', amount: 999, category: 'Bills', currency: 'INR' },
  { name: 'Google One', amount: 1300, category: 'Work', currency: 'INR', cycle: 'yearly' },
  { name: 'Gym', amount: 2000, category: 'Lifestyle', currency: 'INR' },
  { name: 'Amazon Prime', amount: 1499, category: 'Entertainment', currency: 'INR', cycle: 'yearly' },
];

const CATEGORIES: { label: string, value: Category, icon: any }[] = [
    { label: 'Entertainment', value: 'Entertainment', icon: Icons.Entertainment },
    { label: 'Bills', value: 'Bills', icon: Icons.Bills },
    { label: 'Work', value: 'Work', icon: Icons.Work },
    { label: 'Lifestyle', value: 'Lifestyle', icon: Icons.Lifestyle },
    { label: 'Others', value: 'Other', icon: Icons.Other },
];

const CURRENCIES: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

export const SubscriptionEditor: React.FC<Props> = ({ isOpen, onClose, onSave, onDelete, initialData, defaultCurrency }) => {
  const [step, setStep] = useState(0); // 0: Name, 1: Cost/Cycle, 2: Dates/Category
  const [formData, setFormData] = useState({
      name: '',
      amount: '',
      currency: defaultCurrency,
      date: new Date().toISOString().split('T')[0],
      isTrial: false,
      billing_cycle: 'monthly',
      category: 'Bills' as Category,
      auto_renew: true
  });

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                name: initialData.name,
                amount: initialData.amount.toString(),
                currency: initialData.currency,
                date: initialData.next_billing.split('T')[0],
                isTrial: initialData.is_trial,
                billing_cycle: initialData.billing_cycle,
                category: initialData.category,
                auto_renew: initialData.auto_renew
            });
            setStep(3); // Go to "All in one" view for editing
        } else {
            setFormData({
                name: '',
                amount: '',
                currency: defaultCurrency,
                date: new Date().toISOString().split('T')[0],
                isTrial: false,
                billing_cycle: 'monthly',
                category: 'Bills',
                auto_renew: true
            });
            setStep(0); // Start from beginning for new
        }
    }
  }, [initialData, isOpen, defaultCurrency]);

  const hasChanges = useMemo(() => {
    if (!initialData) return true; // Always allow save for new entries (validated elsewhere)
    return (
        initialData.name !== formData.name ||
        initialData.amount.toString() !== formData.amount ||
        initialData.currency !== formData.currency ||
        initialData.billing_cycle !== formData.billing_cycle ||
        initialData.next_billing.split('T')[0] !== formData.date ||
        initialData.category !== formData.category ||
        initialData.auto_renew !== formData.auto_renew ||
        initialData.is_trial !== formData.isTrial
    );
  }, [formData, initialData]);

  const isValid = useMemo(() => {
      return formData.name.trim().length > 0 && formData.amount.trim().length > 0;
  }, [formData.name, formData.amount]);

  const handleSubmit = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!isValid || (initialData && !hasChanges)) return;
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      next_billing: new Date(formData.date).toISOString(),
    });
    onClose();
  };

  const handlePreset = (preset: any) => {
    setFormData(prev => ({
        ...prev,
        name: preset.name,
        amount: preset.amount.toString(),
        category: preset.category,
        currency: preset.currency,
        billing_cycle: preset.cycle || 'monthly'
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Reusable Category Scroll Component
  const CategoryScroll = () => (
    <div className="relative -mx-6">
        <div className="flex gap-3 overflow-x-auto pb-4 px-6 no-scrollbar snap-x">
            {CATEGORIES.map(cat => (
                <div 
                    key={cat.value}
                    onClick={() => setFormData(prev => ({...prev, category: cat.value}))}
                    className={cn(
                        "flex flex-col items-center justify-center py-2 px-3 rounded-xl cursor-pointer border h-20 transition-all text-center snap-start flex-shrink-0 min-w-[80px]",
                        formData.category === cat.value 
                            ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                >
                    <cat.icon size={20} className="mb-1.5" />
                    <span className="font-medium text-[11px] whitespace-nowrap px-1">{cat.label}</span>
                </div>
            ))}
            {/* Spacer for right padding scroll */}
            <div className="w-1 flex-shrink-0" /> 
        </div>
         {/* Visual cue for scrolling (fade) */}
        <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );

  // --- Step Components ---

  const StepOne = () => (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <Typography variant="h5" fontWeight="bold" gutterBottom>What's the subscription?</Typography>
            <Typography variant="body2" color="text.secondary">Choose a preset or type a name.</Typography>
          </div>

          <TextField
              autoFocus
              label="Service Name"
              placeholder="e.g. Netflix"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              InputProps={{ sx: { borderRadius: 3, fontSize: '1.2rem' } }}
          />

          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>POPULAR SERVICES</Typography>
            <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                    <Chip 
                        key={p.name} 
                        label={p.name} 
                        onClick={() => handlePreset(p)} 
                        variant={formData.name === p.name ? "filled" : "outlined"}
                        color={formData.name === p.name ? "primary" : "default"}
                        sx={{ borderRadius: 2 }}
                    />
                ))}
            </div>
          </Box>
      </div>
  );

  const StepTwo = () => (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div>
            <Typography variant="h5" fontWeight="bold" gutterBottom>How much does it cost?</Typography>
            <Typography variant="body2" color="text.secondary">Enter the recurring amount and cycle.</Typography>
          </div>

           <TextField
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            InputProps={{
                sx: { 
                    borderRadius: 3, 
                    fontSize: '1.2rem',
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                        "-webkit-appearance": "none",
                        margin: 0,
                    },
                    "& input[type=number]": {
                        "-moz-appearance": "textfield",
                    },
                },
                startAdornment: (
                    <InputAdornment position="start">
                        <Select
                            variant="standard"
                            disableUnderline
                            value={formData.currency}
                            onChange={(e) => setFormData({...formData, currency: e.target.value as Currency})}
                            sx={{ fontWeight: 'bold' }}
                        >
                            {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </InputAdornment>
                )
            }}
            />
            
            <div className="grid grid-cols-3 gap-2">
                {['monthly', 'yearly', 'weekly'].map((cycle) => (
                    <button
                        key={cycle}
                        onClick={() => setFormData({...formData, billing_cycle: cycle as any})}
                        className={cn(
                            "py-3 px-2 rounded-xl text-sm font-semibold border transition-all capitalize",
                            formData.billing_cycle === cycle 
                                ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        )}
                    >
                        {cycle}
                    </button>
                ))}
            </div>
      </div>
  );

  const StepThree = () => (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Final Details</Typography>
            <Typography variant="body2" color="text.secondary">When is it due & what is it for?</Typography>
          </div>

            <div className="grid grid-cols-2 gap-4">
                 <TextField
                    label={formData.auto_renew ? "Anchor Date (Due Day)" : "Expiry Date"}
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: 3 } }}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                
                <FormControlLabel
                    control={
                    <Switch 
                        checked={formData.auto_renew}
                        onChange={(e) => setFormData({...formData, auto_renew: e.target.checked})}
                        color="primary"
                    />
                    }
                    label={<Typography variant="body2" fontWeight="bold">Auto-Renews</Typography>}
                    sx={{ ml: 1 }}
                />
            </div>

            <div>
                 <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'block', mb: 1 }}>CATEGORY</Typography>
                 <CategoryScroll />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
                 <FormControlLabel
                    control={
                    <Switch 
                        checked={formData.isTrial}
                        onChange={(e) => setFormData({...formData, isTrial: e.target.checked})}
                        color="warning"
                    />
                    }
                    label={
                        <div>
                            <Typography variant="body2" fontWeight="bold">Is this a Free Trial?</Typography>
                        </div>
                    }
                />
            </div>
      </div>
  );

  // Unified Form for Editing (All fields visible)
  const FullEditForm = () => (
      <div className="flex flex-col gap-6">
         {/* Name & Cost */}
         <div className="space-y-4">
            <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                InputProps={{ sx: { borderRadius: 3 } }}
            />
            <div className="flex gap-3">
                 <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    InputProps={{ 
                        sx: { 
                            borderRadius: 3,
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                                margin: 0,
                            },
                            "& input[type=number]": {
                                "-moz-appearance": "textfield",
                            },
                        },
                        startAdornment: <InputAdornment position="start">
                            <Select
                                variant="standard"
                                disableUnderline
                                value={formData.currency}
                                onChange={(e) => setFormData({...formData, currency: e.target.value as Currency})}
                                sx={{ fontWeight: 'bold' }}
                            >
                                {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </InputAdornment>
                    }}
                />
            </div>
            {/* Billing Cycle Buttons */}
             <div className="flex bg-slate-100 p-1 rounded-xl">
                {['monthly', 'yearly', 'weekly'].map((cycle) => (
                    <button
                        key={cycle}
                        onClick={() => setFormData({...formData, billing_cycle: cycle as any})}
                        className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize",
                            formData.billing_cycle === cycle 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {cycle}
                    </button>
                ))}
            </div>
         </div>

         <div className="h-px bg-slate-100 my-2" />

         {/* Category & Date */}
         <div className="space-y-4">
             <div className="relative -mx-6">
                <div className="flex gap-3 overflow-x-auto pb-2 px-6 no-scrollbar snap-x">
                    {CATEGORIES.map(cat => (
                        <div 
                            key={cat.value}
                            onClick={() => setFormData(prev => ({...prev, category: cat.value}))}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer border h-16 transition-all text-center snap-start flex-shrink-0 min-w-[70px]",
                                formData.category === cat.value 
                                    ? "bg-slate-800 text-white border-slate-800" 
                                    : "bg-white border-slate-200 text-slate-400"
                            )}
                        >
                            <cat.icon size={18} />
                            <span className="text-[10px] mt-1 font-medium leading-none whitespace-nowrap px-1">{cat.label}</span>
                        </div>
                    ))}
                    <div className="w-1 flex-shrink-0" /> 
                </div>
                 <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
            
            <TextField
                label={formData.auto_renew ? "Anchor Date (Due Day)" : "Expiry Date"}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                InputProps={{ sx: { borderRadius: 3 } }}
                helperText={formData.auto_renew ? "The day of month/year charges occur. We'll automatically calculate future dates." : ""}
            />
         </div>

         <div className="h-px bg-slate-100 my-2" />

         {/* Settings */}
         <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                 <Typography variant="body2" fontWeight="bold">Auto-Renew</Typography>
                 <Switch checked={formData.auto_renew} onChange={(e) => setFormData({...formData, auto_renew: e.target.checked})} />
            </div>

            {formData.auto_renew && (
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl text-amber-900">
                    <Typography variant="body2" fontWeight="bold">Free Trial Mode</Typography>
                    <Switch color="warning" checked={formData.isTrial} onChange={(e) => setFormData({...formData, isTrial: e.target.checked})} />
                </div>
            )}
         </div>

         {/* Delete Action */}
         {initialData && onDelete && (
             <div className="mt-8 pt-4 border-t border-slate-100">
                <Button 
                    onClick={() => { if(window.confirm('Are you sure?')) { onDelete(initialData.id); onClose(); } }}
                    variant="outlined" 
                    color="error"
                    fullWidth 
                    size="large"
                    startIcon={<Icons.Delete />}
                    sx={{ borderRadius: 4, py: 1.5, borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                    Delete Subscription
                </Button>
             </div>
         )}
      </div>
  );

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullScreen
      TransitionComponent={Transition}
      PaperProps={{
        sx: { bgcolor: '#ffffff' }
      }}
    >
        <div className="max-w-md mx-auto w-full h-full flex flex-col p-6">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                {step > 0 && step < 3 ? (
                    <IconButton onClick={prevStep} edge="start" className="bg-slate-50">
                        <Icons.ChevronRight className="rotate-180" size={24} />
                    </IconButton>
                ) : (
                    <IconButton onClick={onClose} edge="start" className="bg-slate-50">
                        <Icons.Close size={24} />
                    </IconButton>
                )}

                <div className="flex gap-1">
                    {/* Step Indicators for Add Mode */}
                    {!initialData && [0,1,2].map(i => (
                        <div 
                            key={i} 
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                step === i ? "bg-brand-500 w-6" : step > i ? "bg-slate-300" : "bg-slate-100"
                            )}
                        />
                    ))}
                </div>
                
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                {step === 0 && <StepOne />}
                {step === 1 && <StepTwo />}
                {step === 2 && <StepThree />}
                {step === 3 && <FullEditForm />}
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto pt-4">
                {step < 2 && !initialData ? (
                     <Button 
                        onClick={nextStep}
                        variant="contained" 
                        fullWidth 
                        size="large"
                        disableElevation
                        disabled={step === 0 && !formData.name}
                        sx={{ borderRadius: 4, py: 2, fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button 
                        onClick={() => handleSubmit()}
                        variant="contained" 
                        fullWidth 
                        size="large"
                        disableElevation
                        disabled={!isValid || (initialData && !hasChanges)}
                        sx={{ borderRadius: 4, py: 2, fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        {initialData ? 'Save Changes' : 'Add Subscription'}
                    </Button>
                )}
            </div>
        </div>
    </Dialog>
  );
};