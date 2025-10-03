import React, { useState, useEffect } from 'react';
import { bankApi, Bank } from '../services/api';
import { Card, CardHeader, CardBody, Button, Alert, Icon } from './ui';
import BankForm from './BankForm';
import BankTable from './BankTable';
import BankStats from './BankStats';

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
          <BankForm
            formData={formData}
            editingBank={editingBank}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={cancelEdit}
          />
        )}

        <BankTable
          banks={banks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {banks.length > 0 && <BankStats banks={banks} />}
      </CardBody>
    </Card>
  );
};

export default BankManager;
