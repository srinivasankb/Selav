import React from 'react';
import { Icons } from './Icons';
import { motion } from 'framer-motion';

interface Props {
    onLaunchApp: () => void;
    onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchApp, onNavigate }) => {
    
    // Google Icon SVG
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

    // Github Icon SVG
    const GithubIcon = () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden flex flex-col">
            {/* Nav */}
            <nav className="max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <Icons.Calendar size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Selav</span>
                </div>
                <div className="flex gap-4 items-center">
                    <a 
                        href="https://github.com/srinivasankb/Selav" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <GithubIcon />
                        <span className="opacity-80">Open Source</span>
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-20 pb-20 px-6 text-center max-w-4xl mx-auto relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl -z-10"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <a 
                        href="https://github.com/srinivasankb/Selav" 
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold tracking-wide mb-8 transition-colors cursor-pointer group"
                    >
                        <GithubIcon />
                        100% Free & Open Source
                        <Icons.ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/>
                    </a>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        The Subscription <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-rose-500">Death Clock.</span>
                    </h1>
                    
                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Track recurring expenses, monitor your monthly burn rate, and manage free trials securely. 
                        <strong> Zero-Knowledge Encryption</strong> ensures only you see your data.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={onLaunchApp} 
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <div className="bg-white rounded-full p-1"><GoogleIcon /></div>
                            Continue with Google
                        </button>
                        <button onClick={() => onNavigate('/guide')} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                            How it Works <Icons.ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Icons.CheckRaw size={16} className="text-emerald-500" /> No Monthly Fees</span>
                        <span className="flex items-center gap-1"><Icons.CheckRaw size={16} className="text-emerald-500" /> Client-Side Encryption</span>
                        <span className="flex items-center gap-1"><Icons.CheckRaw size={16} className="text-emerald-500" /> PWA Ready</span>
                    </div>
                </motion.div>
            </header>

            {/* Core Features */}
            <section className="bg-slate-50 py-24 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why use Selav?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Most finance apps sell your data. Selav encrypts it. We built this because we were tired of forgetting to cancel "Free" trials.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Icons.ShieldCheck size={32} className="text-emerald-500" />}
                            title="Zero-Knowledge Vault"
                            desc="We use a PIN-derived key to encrypt your data in the browser before saving. We technically cannot read your financial data."
                        />
                        <FeatureCard 
                            icon={<Icons.Zap size={32} className="text-brand-500" />}
                            title="Visual Urgency"
                            desc="Subscriptions are color-coded based on urgency. 'Critical' red pulse means a bill is due or a trial ends in <3 days."
                        />
                        <FeatureCard 
                            icon={<Icons.RefreshCw size={32} className="text-blue-500" />}
                            title="True Monthly Burn"
                            desc="We normalize weekly, monthly, and yearly subscriptions into a single 'Monthly Burn' metric so you know your true outflow."
                        />
                        <FeatureCard 
                            icon={<Icons.Smartphone size={32} className="text-purple-500" />}
                            title="Install as App"
                            desc="Selav is a Progressive Web App (PWA). Add it to your home screen for a native-like experience without the app store."
                        />
                        <FeatureCard 
                            icon={<Icons.Globe size={32} className="text-orange-500" />}
                            title="Multi-Currency"
                            desc="Support for INR, USD, EUR, and GBP. We automatically convert foreign subscriptions to your base currency for stats."
                        />
                         <FeatureCard 
                            icon={<div className="text-slate-700"><GithubIcon /></div>}
                            title="Open Source"
                            desc="The code is transparent. You can audit the security mechanisms yourself on our GitHub repository."
                        />
                    </div>
                </div>
            </section>

             {/* Footer */}
             <footer className="py-16 text-center text-slate-500 text-sm mt-auto bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex justify-center items-center gap-2 mb-8 text-slate-900 font-bold opacity-80 text-lg">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <Icons.Calendar size={18} />
                        </div>
                        Selav
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 font-medium">
                        <button onClick={() => onNavigate('/privacy')} className="hover:text-brand-600 transition-colors">Privacy Policy</button>
                        <button onClick={() => onNavigate('/terms')} className="hover:text-brand-600 transition-colors">Terms of Service</button>
                        <button onClick={() => onNavigate('/guide')} className="hover:text-brand-600 transition-colors">User Guide</button>
                        <a href="https://github.com/srinivasankb/Selav" target="_blank" rel="noreferrer" className="hover:text-brand-600 transition-colors">GitHub</a>
                    </div>

                    <div className="h-px w-24 bg-slate-100 mx-auto mb-8"></div>
                    
                    <p className="mb-4">
                        Contact us at <a href="mailto:hi@srinikb.in" className="text-slate-700 hover:text-brand-600 underline decoration-slate-200 underline-offset-4">hi@srinikb.in</a>
                    </p>
                    
                    <p className="opacity-75">
                        &copy; {new Date().getFullYear()} Selav. Created by <a href="https://srinivasan.online/" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-brand-600 font-medium">Srinivasan KB</a>.
                    </p>
                </div>
             </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="mb-5 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
);