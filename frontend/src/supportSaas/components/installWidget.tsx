import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Button } from '@/components/ui/button';
import type { Workspace } from '../types';

/** Shows only the public widget identifier in the shared-layout installation snippet. */
export default function InstallWidget({ workspace }: { workspace: Workspace }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const snippet = `<script src="${window.location.origin}/widget.js" data-widget="${workspace.widgetId}" defer></script>`;
  /** Copies the public snippet without touching account credentials. */
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setMessage(t('supportCustomer.copied'));
    } catch {
      setMessage(t('supportCustomer.copyFailed'));
    }
  }
  if (workspace.status !== 'ready')
    return <p>{t('supportCustomer.setupFirst')}</p>;
  return (
    <Card variant="subtle" padding="lg" className="max-w-3xl min-w-0">
      <CardTitle>{t('supportCustomer.install')}</CardTitle>
      <CardDescription>{t('supportCustomer.installHint')}</CardDescription>
      <div dir="ltr" className="min-w-0">
        <CodeBlock wrap="anywhere">{snippet}</CodeBlock>
      </div>
      <Button
        size="touch"
        variant="outline"
        className="self-start"
        onClick={() => void copy()}
      >
        {t('supportCustomer.copy')}
      </Button>
      <p role="status">{message}</p>
    </Card>
  );
}
