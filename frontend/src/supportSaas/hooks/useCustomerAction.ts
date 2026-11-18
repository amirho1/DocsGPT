import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerApiError } from '../api/customerApi';

/** Serializes a customer action and projects server-safe errors into the form. */
export default function useCustomerAction() {
  const { t } = useTranslation();
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  /** Runs at most one action at a time, preserving the form on failure. */
  async function perform(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      if (failure instanceof CustomerApiError && failure.status === 401)
        window.location.replace('/login');
      else
        setError(
          failure instanceof CustomerApiError && failure.message
            ? failure.message
            : t('supportCustomer.connectionError'),
        );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return { busy, error, perform };
}
