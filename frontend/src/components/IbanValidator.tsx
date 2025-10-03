import React, { useState, useCallback } from 'react';
import { ibanApi, IbanValidationResponse } from '../services/api';
import { Card, CardHeader, CardBody, Icon } from './ui';
import IbanInput from './IbanInput';
import IbanResult from './IbanResult';
import IbanExamples from './IbanExamples';

const IbanValidator: React.FC = () => {
    const [iban, setIban] = useState('');
    const [result, setResult] = useState<IbanValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatIban = useCallback((value: string) => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        return cleaned.replace(/(.{4})/g, '$1 ').trim();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatIban(e.target.value);
        setIban(formatted);
        if (result) setResult(null);
        if (error) setError(null);
    };

    const validateIban = async () => {
        if (!iban.trim()) {
            setError('Bitte geben Sie eine IBAN ein');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await ibanApi.validateIban({ iban });
            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Validierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            validateIban();
        }
    };

    const clearInput = () => {
        setIban('');
        setResult(null);
        setError(null);
    };

    const handleSelectExample = (exampleIban: string) => {
        setIban(exampleIban);
        setResult(null);
        setError(null);
    };

    return (
        <Card className="animate-slide-up">
            <CardHeader gradient="primary">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Icon name="card" className="text-primary-700" size={24}/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">IBAN-Validator</h2>
                        <p className="text-primary-100 text-sm">Internationale Bankkontonummern validieren</p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-6">
                <IbanInput
                    iban={iban}
                    loading={loading}
                    error={error}
                    onIbanChange={handleInputChange}
                    onValidate={validateIban}
                    onClear={clearInput}
                    onKeyPress={handleKeyPress}
                />

                {result && <IbanResult result={result} />}

                <IbanExamples
                    onSelectExample={handleSelectExample}
                    disabled={loading}
                />
            </CardBody>
        </Card>
    );
};

export default IbanValidator;
