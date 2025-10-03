import React, { useState } from 'react';
import IbanValidator from './components/IbanValidator';
import BankManager from './components/BankManager';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'validator' | 'banks'>('validator');

    if (import.meta.env.VITE_ENABLE_ERROR_TEST === 'true') {
        throw new Error('Test Error: ErrorBoundary funktioniert!');
    }

    const handleLogoClick = () => {
        setActiveTab('validator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (tab: 'validator' | 'banks') => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <AppHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogoClick={handleLogoClick}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in">
                    {activeTab === 'validator' && <IbanValidator />}
                    {activeTab === 'banks' && <BankManager />}
                </div>
            </main>

            <AppFooter />
        </div>
    );
};

export default App;
