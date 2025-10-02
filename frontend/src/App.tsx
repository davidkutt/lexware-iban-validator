import React, {useState} from 'react';
import IbanValidator from './components/IbanValidator';
import BankManager from './components/BankManager';
import {Icon} from './components/ui';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'validator' | 'banks'>('validator');

    if (import.meta.env.VITE_ENABLE_ERROR_TEST === 'true') {
        throw new Error('Test Error: ErrorBoundary funktioniert!');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <nav
                className="bg-white shadow-xl border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                    <Icon name="card" className="text-white" size={20}/>
                                </div>
                                <div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
                                onClick={() => setActiveTab('validator')}
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
                                onClick={() => setActiveTab('banks')}
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fade-in">
                    {activeTab === 'validator' && <IbanValidator/>}
                    {activeTab === 'banks' && <BankManager/>}
                </div>
            </main>

            <footer
                className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                Über
                            </h3>
                            <p className="text-sm text-gray-400">
                                Professioneller IBAN-Validierungs-Microservice mit Bankverwaltungsfunktionen.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Coding Aufgabe für Lexware
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                                Entwickelt mit
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <TechBadge name="Spring Boot" color="green" link="https://spring.io/"/>
                                <TechBadge name="React" color="blue" link="https://reactjs.org/"/>
                                <TechBadge name="TypeScript" color="blue" link="https://www.typescriptlang.org/"/>
                                <TechBadge name="Tailwind" color="cyan" link="https://tailwindcss.com/"/>
                                <TechBadge name="PostgreSQL" color="indigo" link="https://www.postgresql.org/"/>
                            </div>
                        </div>
                    </div>

                    <div className=" mt-8 pt-6 border-t border-gray-700 text-center">
                        <p className=" text-xs text-gray-500">
                            © 2025 David Kutt
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const TechBadge: React.FC<{ name: string; color: string, link: string }> = ({name, color, link}) => {
    const colors: Record<string, string> = {
        green: 'bg-green-900 text-green-300',
        blue: 'bg-blue-900 text-blue-300',
        cyan: 'bg-cyan-900 text-cyan-300',
        indigo: 'bg-indigo-900 text-indigo-300'
    };

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>
      {name}
    </span>
        </a>
    );
};

export default App;
