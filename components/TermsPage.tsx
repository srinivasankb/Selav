import React from 'react';
import { Icons } from './Icons';

export const TermsPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <nav className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                        <Icons.Calendar size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Selav</span>
                </div>
                <button onClick={() => onNavigate('/')} className="text-slate-500 hover:text-slate-900 font-medium text-sm flex items-center gap-2">
                    <Icons.ArrowRight className="rotate-180" size={16} /> Back
                </button>
            </nav>
            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-900">Terms of Service</h1>
                <p className="text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
                
                <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Selav ("the Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">2. User Responsibility for Security</h2>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900 text-sm mb-4">
                            <strong>CRITICAL NOTICE:</strong> You are solely responsible for remembering your Vault PIN.
                        </div>
                        <p>
                            Selav uses client-side encryption. We do not store your PIN or a backup of your encryption key. 
                            <strong>If you lose your PIN, your data is permanently lost.</strong> We cannot recover it for you.
                            By using this service, you acknowledge and accept this risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Authentication</h2>
                        <p>
                            Access to the Service is permitted only via <strong>Google Authentication</strong>. You are responsible for maintaining the security of your Google account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Selav makes no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the service.
                            We are not responsible for any financial losses incurred due to missed subscription notifications or calculation errors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};