import React from 'react';

interface TechBadgeProps {
    name: string;
    color: string;
    link: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ name, color, link }) => {
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

const AppFooter: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16 border-t border-gray-700">
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

                <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                    <p className="text-xs text-gray-500">
                        © 2025 David Kutt
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
