import React from 'react';
import { IbanValidationResponse } from '../services/api';
import { Alert, Badge, Icon, InfoField } from './ui';

interface IbanResultProps {
    result: IbanValidationResponse;
}

const IbanResult: React.FC<IbanResultProps> = ({ result }) => {
    return (
        <div
            className={`rounded-xl border-2 overflow-hidden animate-fade-in ${
                result.valid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}
        >
            <div
                className={`px-6 py-4 ${
                    result.valid
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                } text-white`}
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                        <Icon
                            name={result.valid ? 'check' : 'close'}
                            className={result.valid ? "text-green-600" : "text-red-600"}
                            size={24}
                        />
                    </div>
                    <h3 className="text-lg font-bold">
                        {result.valid ? 'Gültige IBAN' : 'Ungültige IBAN'}
                    </h3>
                </div>
            </div>

            <div className="p-6">
                {result.valid ? (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <InfoField label="IBAN" value={result.iban} mono/>
                            <InfoField
                                label="Land"
                                value={<Badge variant="primary" rounded>{result.countryCode}</Badge>}
                            />
                            <InfoField label="Prüfziffer" value={result.checkDigits} mono/>
                            <InfoField label="Bankleitzahl" value={result.bankCode} mono/>
                            <InfoField label="Kontonummer" value={result.accountNumber} mono/>
                        </div>

                        {result.bank && (
                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Icon name="bank" className="text-green-600" size={24}/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">{result.bank.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">BIC: {result.bank.bic}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Alert variant="error" title="Validierung fehlgeschlagen">
                        {result.errorMessage}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default IbanResult;
