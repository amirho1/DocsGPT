import { Bot, CreditCard, Code, Globe, SlidersHorizontal } from 'lucide-react';
import type { Section } from '@/navigation/sections';
const customerSection: Section = {
  key: 'supportCustomer',
  rootPath: '/dashboard',
  titleKey: 'supportCustomer.title',
  matches: ['/dashboard', '/settings', '/install', '/preview', '/billing'],
  groups: [
    {
      key: 'customer',
      items: [
        {
          key: 'dashboard',
          path: '/dashboard',
          labelKey: 'supportCustomer.website',
          icon: Globe,
        },
        {
          key: 'preview',
          path: '/preview',
          labelKey: 'supportCustomer.preview',
          icon: Bot,
        },
        {
          key: 'settings',
          path: '/settings',
          labelKey: 'supportCustomer.settings',
          icon: SlidersHorizontal,
        },
        {
          key: 'install',
          path: '/install',
          labelKey: 'supportCustomer.install',
          icon: Code,
        },
        {
          key: 'billing',
          path: '/billing',
          labelKey: 'supportCustomer.billing',
          icon: CreditCard,
        },
      ],
    },
  ],
};
export default customerSection;
