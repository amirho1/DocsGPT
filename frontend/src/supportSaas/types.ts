export type Workspace = {
  widgetId: string;
  website: string | null;
  name: string;
  greeting: string;
  color: string;
  supportUrl: string | null;
  status: 'empty' | 'queued' | 'processing' | 'ready' | 'failed';
  firstPaidAt: number | null;
  nextRefreshAt: number | null;
};
export type PortalData = {
  workspace: Workspace;
  access: { active: boolean; expiresAt: number | null; kind: string };
  usage: { answered: number; answerLimit: number; endsAt: number } | null;
  plan: {
    priceToman: number;
    trialDays: number;
    firstPurchaseDays: number;
    renewalDays: number;
    paidAnswers: number;
    periodDays: number;
  };
  checkoutEnabled: boolean;
};
export type Purchase = {
  id: string;
  amountToman: number;
  durationDays: number;
  createdAt: number;
  verifiedAt: number | null;
  status:
    | 'created'
    | 'requesting'
    | 'pending'
    | 'unknown'
    | 'verified'
    | 'activated'
    | 'canceled'
    | 'failed';
};
