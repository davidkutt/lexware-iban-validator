import React, { useState, useCallback } from 'react';
import { ibanApi, IbanValidationResponse } from '../services/api';
import { Card, CardHeader, CardBody, Button, Alert, Badge, Icon, Input, InfoField } from './ui';

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

  return (
    <Card className="animate-slide-up">
      <CardHeader gradient="primary">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Icon name="card" className="text-primary-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">IBAN-Validator</h2>
            <p className="text-primary-100 text-sm">Internationale Bankkontonummern validieren</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="IBAN-Nummer"
              type="text"
              className="text-lg font-mono"
              value={iban}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="DE89 3704 0044 0532 0130 00"
              maxLength={35}
              disabled={loading}
              error={error || undefined}
              helperText="Internationale Bankkontonummer (mit oder ohne Leerzeichen)"
            />
            {iban && !loading && (
              <button
                onClick={clearInput}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Eingabe löschen"
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={validateIban}
            disabled={loading || !iban.trim()}
            loading={loading}
            icon={!loading && <Icon name="check" size={20} />}
          >
            {loading ? 'Validiere...' : 'IBAN Validieren'}
          </Button>
        </div>

        {result && (
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
                  <Icon name={result.valid ? 'check' : 'close'} size={24} />
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
                    <InfoField label="IBAN" value={result.iban} mono />
                    <InfoField label="Land" value={<Badge variant="primary" rounded>{result.countryCode}</Badge>} />
                    <InfoField label="Prüfziffer" value={result.checkDigits} mono />
                    <InfoField label="Bankleitzahl" value={result.bankCode} mono />
                    <InfoField label="Kontonummer" value={result.accountNumber} mono />
                  </div>

                  {result.bank && (
                    <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Icon name="bank" className="text-green-600" size={24} />
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
        )}

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon name="grid" size={16} />
            Beispiel-IBANs zum Testen:
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              'DE89 3704 0044 0532 0130 00',
              'GB29 NWBK 6016 1331 9268 19',
              'FR14 2004 1010 0505 0001 3M02 606'
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setIban(example)}
                disabled={loading}
                className="font-mono"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default IbanValidator;
