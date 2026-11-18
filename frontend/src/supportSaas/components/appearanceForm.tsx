import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { customerRequest } from '../api/customerApi';
import useCustomerAction from '../hooks/useCustomerAction';
import type { Workspace } from '../types';
import CustomerError from './customerError';

/** Allows only the public name, greeting, brand color and support link; no native agent controls. */
export default function AppearanceForm({
  workspace,
  onChange,
}: {
  workspace: Workspace;
  onChange: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    name: workspace.name,
    greeting: workspace.greeting,
    color: workspace.color,
    supportUrl: workspace.supportUrl ?? workspace.website ?? '',
  });
  const [saved, setSaved] = useState(false);
  const action = useCustomerAction();
  if (!workspace.website) return <p>{t('supportCustomer.setupFirst')}</p>;
  return (
    <Card variant="subtle" padding="lg" className="max-w-3xl">
      <CardTitle>{t('supportCustomer.settings')}</CardTitle>
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(false);
          void action.perform(async () => {
            await customerRequest('/settings', settings);
            await onChange();
            setSaved(true);
          });
        }}
      >
        {(['name', 'greeting', 'color', 'supportUrl'] as const).map((key) => (
          <FormField
            key={key}
            float={false}
            label={t(`supportCustomer.${key}`)}
            required
          >
            <Input
              size="touch"
              required
              type={
                key === 'color'
                  ? 'color'
                  : key === 'supportUrl'
                    ? 'url'
                    : 'text'
              }
              value={settings[key]}
              dir={key === 'supportUrl' || key === 'color' ? 'ltr' : undefined}
              onChange={(event) => {
                setSettings({ ...settings, [key]: event.target.value });
                setSaved(false);
              }}
            />
          </FormField>
        ))}
        <CustomerError message={action.error} />
        <Button
          size="touch"
          className="justify-self-start"
          type="submit"
          disabled={action.busy}
        >
          {t('supportCustomer.save')}
        </Button>
        {saved && <p role="status">{t('supportCustomer.saved')}</p>}
      </form>
    </Card>
  );
}
