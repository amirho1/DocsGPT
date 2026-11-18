import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import SectionNav from '@/navigation/SectionNav';
import SectionShell from '@/navigation/SectionShell';
import SectionPageHeader from '@/navigation/SectionPageHeader';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import customerSection from '../customerSection';
import { customerRequest } from '../api/customerApi';
import useCustomerAction from '../hooks/useCustomerAction';
import CustomerError from './customerError';

/** Reuses DocsGPT section navigation, page frame and accessible mobile sheet for the restricted customer routes. */
export default function CustomerFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const action = useCustomerAction();
  const item =
    customerSection.groups[0].items.find((item) => pathname === item.path) ??
    null;
  const navigation = (
    <SectionNav
      section={customerSection}
      activeItemKey={item?.key}
      isAdmin={false}
      itemSize="touch"
      onBack={() => window.location.assign('/')}
      backLabel={t('supportCustomer.home')}
      onNavigate={() => setOpen(false)}
    />
  );
  return (
    <div className="bg-background text-foreground flex h-dvh min-w-0 flex-col">
      <header className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="touch"
              variant="ghost"
              aria-label={t('supportCustomer.menu')}
            >
              <Menu aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent
            title={t('supportCustomer.title')}
            aria-describedby={undefined}
          >
            {navigation}
            <Button size="touch" variant="ghost" onClick={() => setOpen(false)}>
              {t('close')}
            </Button>
          </SheetContent>
        </Sheet>
        <span className="min-w-0 truncate font-semibold">
          {t('supportCustomer.title')}
        </span>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="bg-sidebar hidden w-72 shrink-0 lg:block">
          {navigation}
        </aside>
        <main className="min-w-0 flex-1">
          <SectionShell header={false}>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <SectionPageHeader section={customerSection} item={item} />
              <Button
                size="touch"
                variant="ghost"
                disabled={action.busy}
                onClick={() =>
                  void action.perform(async () => {
                    await customerRequest('/auth/logout', {});
                    window.location.replace('/login');
                  })
                }
              >
                {t('supportCustomer.logout')}
              </Button>
            </div>
            <CustomerError message={action.error} />
            {children}
          </SectionShell>
        </main>
      </div>
    </div>
  );
}
