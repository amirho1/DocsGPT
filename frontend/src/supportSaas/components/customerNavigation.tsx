import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Workflow } from 'lucide-react';
import SectionNav from '@/navigation/SectionNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import customerSection from '../customerSection';

type CustomerNavigationProps = {
  activeItemKey?: string;
  onNavigate: () => void;
};

/** Extends the upstream customer navigation with an explicitly unavailable future feature. */
export default function CustomerNavigation({
  activeItemKey,
  onNavigate,
}: CustomerNavigationProps) {
  const { t } = useTranslation();
  const hintId = useId();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <SectionNav
          section={customerSection}
          activeItemKey={activeItemKey}
          isAdmin={false}
          itemSize="touch"
          onBack={() => window.location.assign('/')}
          backLabel={t('supportCustomer.home')}
          onNavigate={onNavigate}
        />
      </div>
      <div className="border-border shrink-0 border-t p-4">
        <Button
          type="button"
          variant="sidebar-item"
          size="touch"
          disabled
          aria-describedby={hintId}
          className="h-auto min-h-11 w-full flex-wrap text-start whitespace-normal"
        >
          <Workflow className="size-5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            {t('supportCustomer.customPanelFlow')}
          </span>
          <Badge variant="neutral">{t('supportCustomer.futureRelease')}</Badge>
        </Button>
        <p
          id={hintId}
          className="text-muted-foreground mt-2 text-sm leading-relaxed"
        >
          {t('supportCustomer.customPanelFlowHint')}
        </p>
      </div>
    </div>
  );
}
