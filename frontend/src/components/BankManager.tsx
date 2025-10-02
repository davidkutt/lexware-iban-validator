import React, { useState, useEffect } from 'react';
import { bankApi, Bank } from '../services/api';
import { Card, CardHeader, CardBody, Button, Input, Alert, Badge, Icon } from './ui';

const BankManager: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [formData, setFormData] = useState<Bank>({
    name: '',
    bic: '',
    bankCode: '',
    countryCode: ''
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const banksData = await bankApi.getAllBanks();
      setBanks(banksData);
    } catch (err: any) {
      setError('Fehler beim Laden der Banken');
      console.error('Fehler beim Laden der Banken:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : value.toUpperCase()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBank && editingBank.id) {
        const updatedBank = await bankApi.updateBank(editingBank.id, formData);
        setBanks(prev => prev.map(bank =>
          bank.id === editingBank.id ? updatedBank : bank
        ));
      } else {
        const newBank = await bankApi.createBank(formData);
        setBanks(prev => [...prev, newBank]);
      }

      resetForm();
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Fehler beim Speichern der Bank');
    }
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      bic: bank.bic,
      bankCode: bank.bankCode,
      countryCode: bank.countryCode
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, bankName: string) => {
    if (!window.confirm(`Möchten Sie "${bankName}" wirklich löschen?`)) {
      return;
    }

    try {
      await bankApi.deleteBank(id);
      setBanks(prev => prev.filter(bank => bank.id !== id));
    } catch (err: any) {
      setError('Fehler beim Löschen der Bank');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bic: '',
      bankCode: '',
      countryCode: ''
    });
    setEditingBank(null);
    setError(null);
  };

  const cancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center justify-center py-16">
          <Icon name="spinner" className="text-success-600 mb-4" size={48} />
          <p className="text-gray-500 text-lg">Lade Banken...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader gradient="success">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Icon name="bank" className="text-success-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bankverwaltung</h2>
              <p className="text-success-100 text-sm">{banks.length} Banken registriert</p>
            </div>
          </div>
          <Button
            variant='ghost'
            onClick={() => {
              if (showForm) {
                cancelEdit();
              } else {
                setShowForm(true);
              }
            }}
            icon={<Icon name={showForm ? 'close' : 'plus'} size={16} />}
            className="!bg-success-600 !bg-opacity-20 hover:!bg-opacity-30 !text-white"
          >
            {showForm ? 'Abbrechen' : 'Bank hinzufügen'}
          </Button>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {showForm && (
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Bankname"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="z.B. Deutsche Bank AG"
                    required
                  />

                  <Input
                    label="BIC"
                    name="bic"
                    value={formData.bic}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="z.B. 10070000 (DE) oder 123456 (GB)"
                    className="font-mono"
                    helperText="BLZ (DE), Sort Code (GB), etc."
                    required
                  />

                  <Input
                    label="Ländercode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
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
                    onClick={cancelEdit}
                    icon={<Icon name="close" size={16} />}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                            onClick={() => handleEdit(bank)}
                            icon={<Icon name="edit" size={16} />}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            aria-label="Bank bearbeiten"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(bank.id!, bank.name)}
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

        {banks.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <StatCard value={banks.length} label="Banken gesamt" color="gray" />
              <StatCard
                value={new Set(banks.map(b => b.countryCode)).size}
                label="Länder"
                color="blue"
              />
              <StatCard
                value={banks.filter(b => b.countryCode === 'DE').length}
                label="Deutsche Banken"
                color="green"
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const TableHeader: React.FC<{ icon: any; children: React.ReactNode }> = ({ icon, children }) => (
  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
    <div className="flex items-center space-x-2">
      <Icon name={icon} size={16} />
      <span>{children}</span>
    </div>
  </th>
);

const StatCard: React.FC<{ value: number; label: string; color: 'gray' | 'blue' | 'green' }> = ({
  value,
  label,
  color
}) => {
  const colors = {
    gray: 'text-gray-900',
    blue: 'text-blue-600',
    green: 'text-green-600'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

export default BankManager;
