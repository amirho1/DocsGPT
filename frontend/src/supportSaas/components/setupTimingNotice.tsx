import { useTranslation } from 'react-i18next';
import { Clock3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/** Explains the beta setup estimate without promising an exact completion time. */
export default function SetupTimingNotice() {
  const { t } = useTranslation();
  return (
    <Alert variant="info" icon={Clock3} role="note">
      <AlertTitle>
        <span className="text-foreground block leading-relaxed">
          {t('supportCustomer.setupTimingTitle')}
        </span>
      </AlertTitle>
      <AlertDescription>
        <p className="text-foreground">
          {t('supportCustomer.setupTimingHint')}
        </p>
      </AlertDescription>
    </Alert>
  );
}
