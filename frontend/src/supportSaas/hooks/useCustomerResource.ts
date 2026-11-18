import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customerRequest, CustomerApiError } from '../api/customerApi';

/** Loads an owner-scoped projection; session expiry returns to phone login without changing other sessions. */
export default function useCustomerResource<T>(path: string, poll = false) {
  const { t } = useTranslation();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    try {
      setData(await customerRequest<T>(path));
      setError('');
    } catch (failure) {
      if (failure instanceof CustomerApiError && failure.status === 401) {
        window.location.replace('/login');
        return;
      }
      setError(
        failure instanceof CustomerApiError && failure.message
          ? failure.message
          : t('supportCustomer.connectionError'),
      );
    }
  }, [path, t]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!poll) return;
    const timer = setInterval(() => void refresh(), 5000);
    return () => clearInterval(timer);
  }, [poll, refresh]);
  return { data, error, refresh };
}
