import React, { useState, useCallback } from 'react';
import { Bank } from '../services/api';
import { Card, CardHeader, CardBody, Button, Alert, Icon } from './ui';
import BankForm from './BankForm';
import BankTable from './BankTable';
import BankStats from './BankStats';
import { useBankCrud, useFormState } from '../hooks';

const BankManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    banks,
    loading,
    error,
    createBank,
    updateBank,
    deleteBank,
    clearError
  } = useBankCrud();

  const {
    formData,
    editingItem: editingBank,
    handleInputChange,
    resetForm,
    startEditing
  } = useFormState<Bank>({
    name: '',
    bic: '',
    bankCode: '',
    countryCode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBank && editingBank.id) {
        await updateBank(editingBank.id, formData);
      } else {
        await createBank(formData);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
    }
  };

  const handleEdit = useCallback((bank: Bank) => {
    startEditing(bank);
    setShowForm(true);
  }, [startEditing]);

  const handleDelete = useCallback(async (id: number, bankName: string) => {
    try {
      await deleteBank(id, bankName);
    } catch (err) {
    }
  }, [deleteBank]);

  const cancelEdit = useCallback(() => {
    resetForm();
    setShowForm(false);
  }, [resetForm]);

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
            className="!bg-success-500 !bg-opacity-20 hover:!bg-opacity-30 !text-white"
          >
            {showForm ? 'Abbrechen' : 'Bank hinzufügen'}
          </Button>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {error && (
          <Alert variant="error" onClose={clearError}>
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
