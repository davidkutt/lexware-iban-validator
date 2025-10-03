import React from 'react';
import { Bank } from '../services/api';
import { Button, Input, Icon } from './ui';

interface BankFormProps {
    formData: Bank;
    editingBank: Bank | null;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const BankForm: React.FC<BankFormProps> = ({
    formData,
    editingBank,
    onInputChange,
    onSubmit,
    onCancel
}) => {
    return (
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border-2 border-primary-200 overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
                <div className="flex items-center space-x-3">
                    <Icon name={editingBank ? 'edit' : 'plus'} className="text-white" size={20} />
                    <h3 className="text-lg font-semibold">
                        {editingBank ? 'Bank bearbeiten' : 'Neue Bank hinzufügen'}
                    </h3>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Bankname"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="z.B. Deutsche Bank AG"
                            required
                        />

                        <Input
                            label="BIC"
                            name="bic"
                            value={formData.bic}
                            onChange={onInputChange}
                            placeholder="z.B. DEUTDEFFXXX"
                            minLength={8}
                            maxLength={11}
                            className="font-mono"
                            helperText="8-11 Zeichen"
                            required
                        />

                        <Input
                            label="Bankleitzahl"
                            name="bankCode"
                            value={formData.bankCode}
                            onChange={onInputChange}
                            placeholder="z.B. 10070000 (DE) oder 123456 (GB)"
                            className="font-mono"
                            helperText="BLZ (DE), Sort Code (GB), etc."
                            required
                        />

                        <Input
                            label="Ländercode"
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={onInputChange}
                            placeholder="z.B. DE, GB, FR"
                            minLength={2}
                            maxLength={2}
                            className="font-mono uppercase"
                            helperText="2 Zeichen (ISO-Code)"
                            required
                        />
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="submit"
                            variant="primary"
                            icon={<Icon name="check" size={16} />}
                        >
                            {editingBank ? 'Bank aktualisieren' : 'Bank erstellen'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            icon={<Icon name="close" size={16} />}
                        >
                            Abbrechen
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankForm;
