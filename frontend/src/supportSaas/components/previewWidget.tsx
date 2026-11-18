import { useTranslation } from 'react-i18next';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Workspace } from '../types';

/** Opens the owner-authenticated DocsGPT widget through the same metered preview endpoint used in production. */
export default function PreviewWidget({ workspace }: { workspace: Workspace }) {
  const { t } = useTranslation();
  if (workspace.status !== 'ready')
    return <p>{t('supportCustomer.setupFirst')}</p>;
  return (
    <Card variant="subtle" padding="lg" className="max-w-3xl">
      <CardTitle>{t('supportCustomer.preview')}</CardTitle>
      <CardDescription>{t('supportCustomer.previewHint')}</CardDescription>
      <Button size="touch" className="self-start" asChild>
        <a
          href={`/embed/${encodeURIComponent(workspace.widgetId)}?preview=1`}
          target="_blank"
          rel="noreferrer"
        >
          {t('supportCustomer.openPreview')}
        </a>
      </Button>
    </Card>
  );
}
