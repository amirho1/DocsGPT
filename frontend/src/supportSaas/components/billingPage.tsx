import { useTranslation } from 'react-i18next';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { customerRequest } from '../api/customerApi';
import useCustomerAction from '../hooks/useCustomerAction';
import useCustomerResource from '../hooks/useCustomerResource';
import formatCustomerDate from '../lib/formatCustomerDate';
import type { PortalData, Purchase } from '../types';
import CustomerError from './customerError';
import AccessSummary from './accessSummary';

/** Shows trusted payment records and recovery; URL success flags never influence the result. */
export default function BillingPage({
  data,
  onChange,
}: {
  data: PortalData;
  onChange: () => Promise<void>;
}) {
  const { t, i18n } = useTranslation();
  const purchases = useCustomerResource<{ purchases: Purchase[] }>('/billing');
  const action = useCustomerAction();
  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <AccessSummary data={data} />
      <Card variant="subtle" padding="lg" className="min-w-0">
        <CardTitle>{t('supportCustomer.payments')}</CardTitle>
        <CardDescription>{t('supportCustomer.paymentHint')}</CardDescription>
        <CustomerError message={purchases.error || action.error} />
        {!purchases.data && !purchases.error && <LoadingState fill="block" />}
        {purchases.data?.purchases.length === 0 && (
          <p>{t('supportCustomer.noPayments')}</p>
        )}
        <ul className="grid gap-3">
          {purchases.data?.purchases.map((purchase) => (
            <li key={purchase.id}>
              <Card variant="filled" padding="sm">
                <p className="font-semibold">
                  {t(`supportCustomer.payment.${purchase.status}`)}
                </p>
                <p>
                  {t('supportCustomer.offer', {
                    amount: purchase.amountToman.toLocaleString(i18n.language),
                    days: purchase.durationDays.toLocaleString(i18n.language),
                  })}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatCustomerDate(
                    purchase.verifiedAt ?? purchase.createdAt,
                    i18n.language,
                  )}
                </p>
              </Card>
            </li>
          ))}
        </ul>
        <Button
          size="touch"
          variant="outline"
          className="self-start"
          disabled={action.busy}
          onClick={() =>
            void action.perform(async () => {
              await customerRequest('/billing/reconcile', {});
              await purchases.refresh();
              await onChange();
            })
          }
        >
          {t('supportCustomer.reconcile')}
        </Button>
      </Card>
    </div>
  );
}
