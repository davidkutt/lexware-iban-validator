import React from 'react';
import { Input, Button, Icon } from './ui';

interface IbanInputProps {
    iban: string;
    loading: boolean;
    error: string | null;
    onIbanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValidate: () => void;
    onClear: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

const IbanInput: React.FC<IbanInputProps> = ({
    iban,
    loading,
    error,
    onIbanChange,
    onValidate,
    onClear,
    onKeyPress
}) => {
    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    label="IBAN-Nummer"
                    type="text"
                    className="text-lg font-mono"
                    value={iban}
                    onChange={onIbanChange}
                    onKeyPress={onKeyPress}
                    placeholder="DE89 3704 0044 0532 0130 00"
                    maxLength={35}
                    disabled={loading}
                    error={error || undefined}
                    helperText="Internationale Bankkontonummer (mit oder ohne Leerzeichen)"
                />
                {iban && !loading && (
                    <button
                        onClick={onClear}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Eingabe löschen"
                    >
                        <Icon name="close" size={18}/>
                    </button>
                )}
            </div>

            <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onValidate}
                disabled={loading || !iban.trim()}
                loading={loading}
                icon={!loading && <Icon name="check" size={20}/>}
            >
                {loading ? 'Validiere...' : 'IBAN Validieren'}
            </Button>
        </div>
    );
};

export default IbanInput;
