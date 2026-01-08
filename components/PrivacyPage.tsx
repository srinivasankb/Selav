import React from 'react';
import { Icons } from './Icons';

export const PrivacyPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
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
                <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-slate-900">Privacy Policy</h1>
                <p className="text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
                
                <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">1. Zero-Knowledge Architecture</h2>
                        <p>
                            Selav is built with privacy as its core feature. We utilize a <strong>Zero-Knowledge Encryption</strong> model for your sensitive financial data. 
                            This means:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Your subscription names, amounts, and incomes are encrypted on your device <strong>before</strong> being sent to our servers.</li>
                            <li>The encryption key is derived from your PIN, which is <strong>never stored</strong> on our servers.</li>
                            <li>We (the developers) cannot read your financial data even if compelled to do so.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
                        <p>We collect the minimum amount of data necessary to provide the service:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Account Info:</strong> We use Google Authentication. We store your email address and avatar URL provided by Google to identify your account.</li>
                            <li><strong>Encrypted Data:</strong> We store blobs of encrypted text representing your subscriptions. Without your PIN, these are just random characters.</li>
                            <li><strong>Metadata:</strong> We store non-sensitive metadata like subscription billing cycles (e.g., "monthly") and dates to send you expiry notifications.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">3. Authentication</h2>
                        <p>
                            We exclusively use <strong>Google Authentication</strong> for secure login. We do not manage passwords. 
                            Your authentication token is handled directly between your browser and Google's servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Deletion</h2>
                        <p>
                            You have full control over your data. You can delete your account and all associated encrypted data instantly from the "Profile" section of the app. 
                            Once deleted, this data is unrecoverable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact Us</h2>
                        <p>
                            If you have questions about security or privacy, please contact us at <a href="mailto:support@selav.srinikb.in" className="text-brand-600 hover:underline">support@selav.srinikb.in</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};