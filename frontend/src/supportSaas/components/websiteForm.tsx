import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { customerRequest } from '../api/customerApi';
import useCustomerAction from '../hooks/useCustomerAction';
import formatCustomerDate from '../lib/formatCustomerDate';
import type { Workspace } from '../types';
import CustomerError from './customerError';
import SetupTimingNotice from './setupTimingNotice';

/** Collects one website URL and exposes the native ingestion lifecycle through the scoped service. */
export default function WebsiteForm({
  workspace,
  onChange,
}: {
  workspace: Workspace;
  onChange: () => Promise<void>;
}) {
  const { t, i18n } = useTranslation();
  const [website, setWebsite] = useState(workspace.website ?? '');
  const action = useCustomerAction();
  useEffect(() => {
    if (!workspace.website) {
      try {
        setWebsite(sessionStorage.getItem('support-website') ?? '');
      } catch {
        /* Storage can be disabled. */
      }
    } else setWebsite(workspace.website);
  }, [workspace.website]);
  const processing = ['queued', 'processing'].includes(workspace.status);
  const coolingDown =
    workspace.status === 'ready' && (workspace.nextRefreshAt ?? 0) > Date.now();
  return (
    <Card variant="subtle" padding="lg" className="max-w-3xl">
      <CardTitle>{t('supportCustomer.website')}</CardTitle>
      <Badge variant="neutral" className="self-start" role="status">
        {t(`supportCustomer.setup.${workspace.status}`)}
      </Badge>
      <CardDescription>{t('supportCustomer.websiteHint')}</CardDescription>
      {workspace.status !== 'ready' && <SetupTimingNotice />}
      <form
        className="mt-3 grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!processing && !coolingDown)
            void action.perform(async () => {
              await customerRequest('/website', { website });
              await onChange();
            });
        }}
      >
        <FormField
          label={t('supportCustomer.websiteUrl')}
          float={false}
          required
        >
          <Input
            size="touch"
            type="text"
            inputMode="url"
            autoComplete="url"
            dir="ltr"
            required
            value={website}
            readOnly={Boolean(workspace.website)}
            onChange={(event) => {
              setWebsite(event.target.value);
              try {
                sessionStorage.setItem('support-website', event.target.value);
              } catch {
                /* Keep the form usable without storage. */
              }
            }}
          />
        </FormField>
        {workspace.status === 'failed' && (
          <Alert variant="warning">
            <AlertDescription>
              <p className="text-foreground">
                {t('supportCustomer.setupFailed')}
              </p>
            </AlertDescription>
          </Alert>
        )}
        <CustomerError message={action.error} />
        <Button
          size="touch"
          className="justify-self-start"
          disabled={action.busy || processing || coolingDown}
          type="submit"
        >
          {action.busy || processing
            ? t('supportCustomer.preparing')
            : workspace.status === 'ready'
              ? t('supportCustomer.refreshWebsite')
              : workspace.status === 'failed'
                ? t('supportCustomer.retry')
                : t('supportCustomer.prepare')}
        </Button>
        {workspace.status === 'ready' && (
          <p className="text-muted-foreground text-sm">
            {t('supportCustomer.nextRefresh', {
              date: formatCustomerDate(workspace.nextRefreshAt, i18n.language),
              interpolation: { escapeValue: false },
            })}
          </p>
        )}
      </form>
    </Card>
  );
}
