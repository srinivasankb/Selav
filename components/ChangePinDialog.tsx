import React, { useState } from 'react';
import { Dialog, Typography, Button, CircularProgress } from '@mui/material';
import { Icons } from './Icons';
import { deriveKeyFromPin, generateVaultCheck, unlockVault, encryptData, decryptData } from '../lib/crypto';
import { User } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
    user: User;
    onUpdateUser: (updates: Partial<User>) => void;
}

export const ChangePinDialog: React.FC<Props> = ({ open, onClose, user, onUpdateUser }) => {
    const [step, setStep] = useState<'verify' | 'new'>('verify');
    const [pin, setPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDigit = (digit: string, isNewPin: boolean) => {
        if (loading) return;
        const currentPin = isNewPin ? newPin : pin;
        if (currentPin.length >= 4) return;
        
        const nextPin = currentPin + digit;
        if (isNewPin) setNewPin(nextPin);
        else setPin(nextPin);

        // Auto-submit when 4 digits reached
        if (nextPin.length === 4) {
            if (isNewPin) handleSetNewPin(nextPin);
            else handleVerify(nextPin);
        }
    };

    const handleVerify = async (inputPin: string) => {
        setLoading(true);
        setError('');
        
        // Slight delay for UX
        await new Promise(r => setTimeout(r, 500));

        const derivedKey = deriveKeyFromPin(inputPin, user.email);
        const checkHash = generateVaultCheck(derivedKey);

        if (checkHash === user.vault_check) {
            setStep('new');
            setPin(''); // Clear for security
        } else {
            setError('Incorrect current PIN');
            setPin('');
        }
        setLoading(false);
    };

    const handleSetNewPin = async (inputPin: string) => {
        setLoading(true);
        // 1. Decrypt data with OLD key (We know the old key is currently active in memory from the session, 
        //    but rigorously we should use the key derived from the verified 'pin' state if we were strict.
        //    However, since we just verified the user, the MEMORY_KEY is valid.)
        
        // 1. Get current monthly income (encrypted)
        const encryptedIncome = localStorage.getItem('monthly_income_enc');
        let rawIncome = null;
        if (encryptedIncome) {
            rawIncome = decryptData(encryptedIncome); // Uses current MEMORY_KEY
        }

        // 2. Generate NEW Key
        const newKey = deriveKeyFromPin(inputPin, user.email);
        const newCheckHash = generateVaultCheck(newKey);

        // 3. Set NEW Key as active
        unlockVault(newKey);

        // 4. Re-encrypt data
        if (rawIncome) {
            const reEncrypted = encryptData(rawIncome);
            localStorage.setItem('monthly_income_enc', reEncrypted);
        }

        // 5. Update User Profile
        onUpdateUser({ vault_check: newCheckHash });
        
        setLoading(false);
        onClose();
        alert("Security PIN updated successfully. Your data has been re-encrypted.");
    };

    const handleClear = () => {
        if (step === 'new') setNewPin('');
        else setPin('');
        setError('');
    };

    const PinDisplay = ({ val }: { val: string }) => (
        <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all ${i < val.length ? 'bg-slate-800 scale-110' : 'bg-slate-200'}`} />
            ))}
        </div>
    );

    const Keypad = ({ isNew }: { isNew: boolean }) => (
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                    key={num}
                    onClick={() => handleDigit(num.toString(), isNew)}
                    className="h-14 rounded-full bg-slate-50 text-xl font-bold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                >
                    {num}
                </button>
            ))}
            <div />
            <button
                onClick={() => handleDigit('0', isNew)}
                className="h-14 rounded-full bg-slate-50 text-xl font-bold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
                0
            </button>
            <button
                onClick={handleClear}
                className="h-14 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            >
                <Icons.Delete size={24} />
            </button>
        </div>
    );

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, p: 2, maxWidth: 360, width: '100%' } }}>
            <div className="p-4 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                    <Icons.Lock size={24} />
                </div>
                
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {step === 'verify' ? 'Enter Current PIN' : 'Set New PIN'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
                    {step === 'verify' 
                        ? 'Verify your identity to re-encrypt your vault.' 
                        : 'Choose a new 4-digit security PIN.'}
                </Typography>

                <PinDisplay val={step === 'verify' ? pin : newPin} />

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <Keypad isNew={step === 'new'} />
                )}

                {error && (
                    <div className="mt-4 text-rose-500 font-medium text-sm flex items-center justify-center gap-2">
                        <Icons.Warning size={16} /> {error}
                    </div>
                )}
            </div>
        </Dialog>
    );
};