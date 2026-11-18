import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import ErrorBoundary from '@/components/ErrorBoundary';
import CustomerFrame from './components/customerFrame';
import CustomerError from './components/customerError';
import WebsiteForm from './components/websiteForm';
import AppearanceForm from './components/appearanceForm';
import InstallWidget from './components/installWidget';
import PreviewWidget from './components/previewWidget';
import BillingPage from './components/billingPage';
import useCustomerResource from './hooks/useCustomerResource';
import type { PortalData } from './types';

/** Mounts only customer routes; the native DocsGPT authentication bootstrap and management routes are absent. */
export default function CustomerApp() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [poll, setPoll] = useState(false);
  const { data, error, refresh } = useCustomerResource<PortalData>(
    '/workspace',
    poll,
  );
  useEffect(() => {
    setPoll(
      data?.workspace.status === 'queued' ||
        data?.workspace.status === 'processing',
    );
  }, [data?.workspace.status]);
  return (
    <CustomerFrame>
      <ErrorBoundary resetKey={pathname}>
        <CustomerError message={error} />
        {!data ? (
          error ? (
            <Button size="touch" onClick={() => void refresh()}>
              {t('supportCustomer.retry')}
            </Button>
          ) : (
            <LoadingState fill="block" label={t('supportCustomer.loading')} />
          )
        ) : (
          <Routes>
            <Route
              path="/dashboard"
              element={
                <WebsiteForm workspace={data.workspace} onChange={refresh} />
              }
            />
            <Route
              path="/settings"
              element={
                <AppearanceForm
                  key={data.workspace.widgetId}
                  workspace={data.workspace}
                  onChange={refresh}
                />
              }
            />
            <Route
              path="/install"
              element={<InstallWidget workspace={data.workspace} />}
            />
            <Route
              path="/preview"
              element={<PreviewWidget workspace={data.workspace} />}
            />
            <Route
              path="/billing"
              element={<BillingPage data={data} onChange={refresh} />}
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="*"
              element={<p role="alert">{t('supportCustomer.notFound')}</p>}
            />
          </Routes>
        )}
      </ErrorBoundary>
    </CustomerFrame>
  );
}
