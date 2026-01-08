import React from 'react';
import { Icons } from './Icons';
import { motion } from 'framer-motion';

interface Props {
    onLaunchApp: () => void;
    onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchApp, onNavigate }) => {
    
    // Google Icon SVG (inline for simplicity)
    const GoogleIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.769 -21.864 51.959 -21.864 51.129 C -21.864 50.299 -21.734 49.489 -21.484 48.729 L -21.484 45.639 L -25.464 45.639 C -26.284 47.269 -26.754 49.129 -26.754 51.129 C -26.754 53.129 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.769 C -12.984 43.769 -11.404 44.379 -10.154 45.579 L -6.734 42.159 C -8.804 40.229 -11.514 39.019 -14.754 39.019 C -19.444 39.019 -23.494 41.719 -25.464 45.639 L -21.484 48.729 C -20.534 45.879 -17.884 43.769 -14.754 43.769 Z" />
            </g>
        </svg>
    );

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden flex flex-col">
            {/* Nav */}
            <nav className="max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                        <Icons.Calendar size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Selav</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => onNavigate('/guide')} className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-brand-600">Guide</button>
                    <button 
                        onClick={onLaunchApp} 
                        className="bg-slate-900 text-white pl-4 pr-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg"
                    >
                         <div className="bg-white rounded-full p-1"><GoogleIcon /></div>
                         <span className="mt-0.5">Sign in</span>
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-20 pb-32 px-6 text-center max-w-4xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl -z-10"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wide mb-6 border border-brand-100 uppercase">
                        Zero-Knowledge Encryption
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                        Stop bleeding money on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-orange-500">forgotten subs.</span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The Subscription Death Clock that tracks your free trials, recurring bills, and monthly burn. 
                        <strong>Only Google Auth allowed</strong> for security.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={onLaunchApp} 
                            className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <div className="bg-white rounded-full p-1"><GoogleIcon /></div>
                            Continue with Google
                        </button>
                        <button onClick={() => onNavigate('/guide')} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                            How it Works <Icons.ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* Features Grid */}
            <section className="bg-slate-50 py-24 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Icons.ShieldCheck size={32} className="text-emerald-500" />}
                            title="Zero-Knowledge Privacy"
                            desc="We use client-side encryption. Your financial data is encrypted with your PIN before it ever leaves your device."
                        />
                        <FeatureCard 
                            icon={<Icons.Zap size={32} className="text-brand-500" />}
                            title="Death Clock Indicators"
                            desc="Visual urgency indicators pulse red when a trial is about to end or a bill is due tomorrow."
                        />
                        <FeatureCard 
                            icon={<Icons.RefreshCw size={32} className="text-blue-500" />}
                            title="Monthly Burn Rate"
                            desc="We calculate exactly how much you spend monthly, normalizing yearly and weekly subscriptions automatically."
                        />
                    </div>
                </div>
            </section>

             {/* Footer */}
             <footer className="py-12 text-center text-slate-400 text-sm mt-auto bg-white">
                <div className="flex justify-center items-center gap-2 mb-4 text-slate-900 font-bold opacity-50">
                     <Icons.Calendar size={16} /> Selav
                </div>
                <div className="flex justify-center gap-6 mb-8">
                    <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
                    <button onClick={() => onNavigate('/terms')} className="hover:text-slate-600 transition-colors">Terms of Service</button>
                    <button onClick={() => onNavigate('/guide')} className="hover:text-slate-600 transition-colors">Guide</button>
                </div>
                <p>&copy; {new Date().getFullYear()} Selav. All rights reserved.</p>
             </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);