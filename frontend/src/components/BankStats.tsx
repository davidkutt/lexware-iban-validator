import React, { useMemo } from 'react';
import { Bank } from '../services/api';

interface BankStatsProps {
    banks: Bank[];
}

interface StatCardProps {
    value: number;
    label: string;
    color: 'gray' | 'blue' | 'green';
}

const STAT_COLORS = {
    gray: 'text-gray-900',
    blue: 'text-blue-600',
    green: 'text-green-600'
} as const;

const StatCard = React.memo<StatCardProps>(({ value, label, color }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className={`text-2xl font-bold ${STAT_COLORS[color]}`}>{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
});
StatCard.displayName = 'StatCard';

const BankStats: React.FC<BankStatsProps> = ({ banks }) => {
    const totalBanks = useMemo(() => banks.length, [banks]);
    const uniqueCountries = useMemo(
        () => new Set(banks.map(b => b.countryCode)).size,
        [banks]
    );
    const germanBanks = useMemo(
        () => banks.filter(b => b.countryCode === 'DE').length,
        [banks]
    );

    return (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <StatCard value={totalBanks} label="Banken gesamt" color="gray" />
                <StatCard value={uniqueCountries} label="Länder" color="blue" />
                <StatCard value={germanBanks} label="Deutsche Banken" color="green" />
            </div>
        </div>
    );
};

export default BankStats;
