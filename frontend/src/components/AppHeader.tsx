import React from 'react';
import { Icon } from './ui';

interface AppHeaderProps {
    activeTab: 'validator' | 'banks';
    onTabChange: (tab: 'validator' | 'banks') => void;
    onLogoClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onTabChange, onLogoClick }) => {
    return (
        <nav className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={onLogoClick}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                <Icon name="card" className="text-white" size={20}/>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                IBAN-Validator
                            </h1>
                            <p className="text-xs text-gray-500">Banking-Microservice</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => onTabChange('validator')}
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'validator'
                                    ? 'bg-white text-primary-700 shadow-md'
                                    : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'
                            }`}
                        >
                            <Icon name="check" size={16}/>
                            <span className="hidden sm:inline">Validator</span>
                        </button>
                        <button
                            onClick={() => onTabChange('banks')}
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'banks'
                                    ? 'bg-white text-success-700 shadow-md'
                                    : 'text-gray-600 hover:text-success-600 hover:bg-white hover:bg-opacity-50'
                            }`}
                        >
                            <Icon name="bank" size={16}/>
                            <span className="hidden sm:inline">Banken</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AppHeader;
