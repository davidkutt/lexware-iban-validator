import React from 'react';
import { Bank } from '../services/api';
import { Badge, Button, Icon } from './ui';

interface BankTableProps {
    banks: Bank[];
    onEdit: (bank: Bank) => void;
    onDelete: (id: number, bankName: string) => void;
}

const TableHeader = React.memo<{ icon: any; children: React.ReactNode }>(({ icon, children }) => (
    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
        <div className="flex items-center space-x-2">
            <Icon name={icon} size={16} />
            <span>{children}</span>
        </div>
    </th>
));
TableHeader.displayName = 'TableHeader';

const BankTable: React.FC<BankTableProps> = ({ banks, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                        <tr>
                            <TableHeader icon="bank">Bankname</TableHeader>
                            <TableHeader icon="code">BIC</TableHeader>
                            <TableHeader icon="grid">Bankleitzahl</TableHeader>
                            <TableHeader icon="flag">Land</TableHeader>
                            <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                                Aktionen
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {banks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Icon name="bank" className="text-gray-400" size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-medium text-gray-900">Keine Banken gefunden</p>
                                            <p className="text-gray-500">Fügen Sie Banken hinzu, um zu beginnen.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            banks.map((bank, index) => (
                                <tr
                                    key={bank.id}
                                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="info">{bank.bic}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="success">{bank.bankCode}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="primary" rounded>{bank.countryCode}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(bank)}
                                                icon={<Icon name="edit" size={16} />}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                aria-label="Bank bearbeiten"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(bank.id!, bank.name)}
                                                icon={<Icon name="delete" size={16} />}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                aria-label="Bank löschen"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BankTable;
