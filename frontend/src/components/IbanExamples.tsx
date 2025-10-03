import React from 'react';
import { Button, Icon } from './ui';

interface IbanExamplesProps {
    onSelectExample: (iban: string) => void;
    disabled?: boolean;
}

const EXAMPLE_IBANS = [
    'DE89 3704 0044 0532 0130 00',
    'GB29 NWBK 6016 1331 9268 19',
    'FR14 2004 1010 0505 0001 3M02 606'
];

const IbanExamples: React.FC<IbanExamplesProps> = ({ onSelectExample, disabled = false }) => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icon name="grid" size={16}/>
                Beispiel-IBANs zum Testen:
            </h3>
            <div className="flex flex-wrap gap-2">
                {EXAMPLE_IBANS.map((example, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectExample(example)}
                        disabled={disabled}
                        className="font-mono"
                    >
                        {example}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default IbanExamples;
