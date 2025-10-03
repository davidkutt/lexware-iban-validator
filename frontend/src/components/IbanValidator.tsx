import React from 'react';
import { Card, CardHeader, CardBody, Icon } from './ui';
import IbanInput from './IbanInput';
import IbanResult from './IbanResult';
import IbanExamples from './IbanExamples';
import { useIbanValidation } from '../hooks';

const IbanValidator: React.FC = () => {
    const {
        iban,
        result,
        loading,
        error,
        handleInputChange,
        validateIban,
        clearInput,
        setIbanValue,
        handleKeyPress
    } = useIbanValidation();

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
                    onSelectExample={setIbanValue}
                    disabled={loading}
                />
            </CardBody>
        </Card>
    );
};

export default IbanValidator;
