import { useState, useCallback } from 'react';

export function useFormState<T extends Record<string, any>>(initialState: T) {
    const [formData, setFormData] = useState<T>(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' ? value : value.toUpperCase()
        }));
    }, []);

    const setFormValues = useCallback((values: Partial<T>) => {
        setFormData(prev => ({ ...prev, ...values }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialState);
        setEditingItem(null);
        setIsEditing(false);
    }, [initialState]);

    const startEditing = useCallback((item: T) => {
        setEditingItem(item);
        setFormData(item);
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        resetForm();
    }, [resetForm]);

    return {
        formData,
        isEditing,
        editingItem,
        handleInputChange,
        setFormValues,
        resetForm,
        startEditing,
        cancelEditing,
        setFormData
    };
}
