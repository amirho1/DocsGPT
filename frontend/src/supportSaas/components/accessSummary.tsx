import { useTranslation } from 'react-i18next';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DescriptionList,
  DescriptionItem,
} from '@/components/ui/description-list';
import { Button } from '@/components/ui/button';
import { customerRequest } from '../api/customerApi';
import useCustomerAction from '../hooks/useCustomerAction';
import formatCustomerDate from '../lib/formatCustomerDate';
import paymentDestination from '../lib/paymentDestination';
import type { PortalData } from '../types';
import CustomerError from './customerError';

/** Displays the server's central plan and starts a durable merchant handoff with an empty pricing payload. */
export default function AccessSummary({ data }: { data: PortalData }) {
  const { t, i18n } = useTranslation();
  const action = useCustomerAction();
  const first = data.workspace.firstPaidAt === null;
  const number = (value: number) => value.toLocaleString(i18n.language);
  return (
    <Card variant="subtle" padding="lg">
      <CardTitle>{t('supportCustomer.access')}</CardTitle>
      <DescriptionList>
        <DescriptionItem label={t('supportCustomer.accessType')}>
          {t(first ? 'supportCustomer.trial' : 'supportCustomer.paid')}
          {!data.access.active && data.access.expiresAt !== null
            ? ` — ${t('supportCustomer.expired')}`
            : ''}
        </DescriptionItem>
        <DescriptionItem label={t('supportCustomer.expires')}>
          {formatCustomerDate(data.access.expiresAt, i18n.language)}
        </DescriptionItem>
        <DescriptionItem label={t('supportCustomer.remaining')}>
          {data.usage
            ? number(Math.max(0, data.usage.answerLimit - data.usage.answered))
            : '—'}
        </DescriptionItem>
        <DescriptionItem label={t('supportCustomer.periodEnd')}>
          {formatCustomerDate(data.usage?.endsAt, i18n.language)}
        </DescriptionItem>
      </DescriptionList>
      <CardDescription>{t('supportCustomer.usageHint')}</CardDescription>
      <p className="font-semibold">
        {t('supportCustomer.offer', {
          amount: number(data.plan.priceToman),
          days: number(
            first ? data.plan.firstPurchaseDays : data.plan.renewalDays,
          ),
        })}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {first
          ? t('supportCustomer.firstPurchaseHint', {
              answers: number(data.plan.paidAnswers),
              days: number(data.plan.periodDays),
            })
          : t('supportCustomer.renewalHint')}
      </p>
      <Button
        size="touch"
        className="self-start"
        disabled={action.busy || !data.checkoutEnabled}
        onClick={() =>
          void action.perform(async () => {
            const result = await customerRequest<{ url: string }>(
              '/billing',
              {},
            );
            window.location.assign(paymentDestination(result.url));
          })
        }
      >
        {t(first ? 'supportCustomer.buy' : 'supportCustomer.renew')}
      </Button>
      {!data.checkoutEnabled && (
        <p role="status" className="text-muted-foreground text-sm">
          {t('supportCustomer.checkoutPaused')}
        </p>
      )}
      <CustomerError message={action.error} />
    </Card>
  );
}
