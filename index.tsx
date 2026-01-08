import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LandingPage } from './components/LandingPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { GuidePage } from './components/GuidePage';
import { loginWithGoogle, isAuthenticated } from './services/pocketbase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const Root = () => {
    // Hash-based routing to prevent SecurityErrors in restricted environments (Blob/Iframe)
    // where history.pushState with URLs is not permitted.
    const getHashPath = () => {
        const hash = window.location.hash;
        return hash.startsWith('#') ? hash.slice(1) : '/';
    };

    const [path, setPath] = useState(getHashPath());

    useEffect(() => {
        const onHashChange = () => setPath(getHashPath());
        window.addEventListener('hashchange', onHashChange);

        // Check for authenticated session on mount
        const currentPath = getHashPath();
        if (isAuthenticated() && currentPath === '/') {
             navigate('/app');
        }
        
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = (newPath: string) => {
        window.location.hash = newPath;
        window.scrollTo(0, 0);
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            
            // Double check auth state before navigating
            if (isAuthenticated()) {
                navigate('/app');
            } else {
                throw new Error("Auth state invalid after successful login sequence");
            }
        } catch (error: any) {
            console.error("Google Login failed", error);
            
            // Helpful error messages for common issues
            if (error?.isAbort) {
                alert("Login cancelled.");
            } else if (error?.originalError?.message?.includes("Failed to fetch")) {
                alert("Connection error. Please check your internet or try disabling ad-blockers.");
            } else {
                alert("Login failed. Please ensure popups are allowed for this site.");
            }
        }
    };

    const renderRoute = () => {
        // Protected App Route
        if (path === '/app') {
            if (!isAuthenticated()) {
                // Redirect to home if not auth
                setTimeout(() => navigate('/'), 0);
                return null;
            }
            return <App />;
        }
        
        if (path === '/privacy') return <PrivacyPage onNavigate={navigate} />;
        if (path === '/terms') return <TermsPage onNavigate={navigate} />;
        if (path === '/guide') return <GuidePage onNavigate={navigate} />;
        
        // Default to Landing
        return <LandingPage onLaunchApp={handleGoogleLogin} onNavigate={navigate} />;
    };

    return (
        <React.StrictMode>
            {renderRoute()}
        </React.StrictMode>
    );
};

const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);