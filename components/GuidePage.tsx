import React from 'react';
import { Icons } from './Icons';

export const GuidePage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
             <nav className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100">
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
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">How to use Selav</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Master your subscriptions with our "Death Clock" approach to recurring expenses.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-6">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Setup</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    When you first log in with <strong>Google</strong>, you'll be asked to create a 4-digit PIN. 
                                    This PIN generates an encryption key on your device. Your data is encrypted <em>before</em> it leaves your browser.
                                </p>
                            </div>
                        </div>

                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Add Subscriptions</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Tap the <Icons.Add className="inline w-4 h-4" /> button. Enter the service name and cost. 
                                    Set the <strong>Billing Cycle</strong> (Monthly/Yearly) and the <strong>Next Due Date</strong>.
                                </p>
                            </div>
                        </div>

                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Monitor The Burn</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    The dashboard calculates your "Monthly Burn". It normalizes yearly and weekly subscriptions so you know exactly what you spend on average every month.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Icons.Zap className="text-amber-500" /> Indicator Guide
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Critical</div>
                                    <div className="text-xs text-slate-500">Due in 3 days or less. Act now.</div>
                                </div>
                            </div>
                             <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Warning</div>
                                    <div className="text-xs text-slate-500">Due within the week.</div>
                                </div>
                            </div>
                             <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <div>
                                    <div className="font-bold text-sm text-slate-900">Safe</div>
                                    <div className="text-xs text-slate-500">More than 7 days remaining.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};