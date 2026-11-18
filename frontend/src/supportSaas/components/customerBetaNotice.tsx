import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

/** Identifies the customer application as a beta with ongoing product development. */
export default function CustomerBetaNotice() {
  const { t } = useTranslation();
  return (
    <div
      className="border-border bg-muted mb-6 flex max-w-3xl flex-wrap items-center gap-3 rounded-xl border p-4"
      role="note"
    >
      <Badge variant="neutral">{t('supportCustomer.beta')}</Badge>
      <p className="text-muted-foreground min-w-0 flex-1 basis-48 text-sm leading-relaxed">
        {t('supportCustomer.betaHint')}
      </p>
    </div>
  );
}
