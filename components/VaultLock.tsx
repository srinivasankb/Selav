import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { deriveKeyFromPin, generateVaultCheck, unlockVault } from '../lib/crypto';
import { User } from '../types';

interface Props {
    user: User;
    onUnlock: () => void;
    onSetup: (vaultCheck: string) => void;
}

export const VaultLock: React.FC<Props> = ({ user, onUnlock, onSetup }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Determine mode: "Setup" (New user) or "Unlock" (Existing user with vault_check)
    const isSetupMode = !user.vault_check;

    const handlePinChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple chars
        
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-submit on filled
        if (index === 3 && value) {
            setTimeout(() => handleSubmit(newPin.join('')), 100);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (fullPin: string) => {
        setIsLoading(true);
        setError('');

        // Simulate minimal delay for UX
        await new Promise(r => setTimeout(r, 300));

        try {
            const key = deriveKeyFromPin(fullPin, user.email);
            
            if (isSetupMode) {
                // Setup Mode: Create the check hash and unlock
                const checkHash = generateVaultCheck(key);
                unlockVault(key);
                onSetup(checkHash);
            } else {
                // Unlock Mode: Verify against stored hash
                const checkHash = generateVaultCheck(key);
                if (checkHash === user.vault_check) {
                    unlockVault(key);
                    onUnlock();
                } else {
                    setError('Incorrect PIN');
                    setPin(['', '', '', '']);
                    document.getElementById('pin-0')?.focus();
                }
            }
        } catch (e) {
            setError('Error processing PIN');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        {isSetupMode ? <Icons.ShieldCheck size={32} /> : <Icons.Lock size={32} />}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {isSetupMode ? 'Create Security PIN' : 'Unlock Vault'}
                    </h2>
                    
                    <p className="text-slate-500 mb-8 text-sm">
                        {isSetupMode 
                            ? "Set a 4-digit PIN to encrypt your data. You will need this PIN to access your subscriptions on other devices." 
                            : "Enter your PIN to decrypt your secure data."}
                    </p>

                    <div className="flex gap-4 mb-8">
                        {pin.map((digit, i) => (
                            <input
                                key={i}
                                id={`pin-${i}`}
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className={`w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold transition-all outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 ${error ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-rose-600 font-medium text-sm mb-4 animate-in fade-in">
                            <Icons.Warning size={16} />
                            {error}
                        </div>
                    )}

                    <div className="text-xs text-slate-400">
                        End-to-End Encrypted. <br/> Server never sees your PIN.
                    </div>
                </div>
            </div>
        </div>
    );
};