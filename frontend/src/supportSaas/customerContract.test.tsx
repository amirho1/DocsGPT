import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import paymentDestination from './lib/paymentDestination';
import { customerRequest, CustomerApiError } from './api/customerApi';
import customerSection from './customerSection';
import customerStore from './customerStore';
import SectionNav from '@/navigation/SectionNav';
import { SidebarLevelProvider } from '@/navigation/SidebarLevelProvider';
import '@/locale/i18n';

afterEach(() => vi.unstubAllGlobals());
describe('customer entry boundaries', () => {
  it('uses upstream navigation with only customer destinations and no admin, connectors, model or tools links', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Provider store={customerStore}>
          <SidebarLevelProvider>
            <SectionNav
              section={customerSection}
              isAdmin={false}
              onBack={() => {}}
              backLabel="Home"
              itemSize="touch"
            />
          </SidebarLevelProvider>
        </Provider>
      </MemoryRouter>,
    );
    expect(html).toContain('data-variant="sidebar-item"');
    for (const path of [
      '/dashboard',
      '/preview',
      '/settings',
      '/install',
      '/billing',
    ])
      expect(html).toContain(`href="${path}"`);
    for (const path of [
      '/admin',
      '/settings/models',
      '/settings/connectors',
      '/agents',
      '/teams',
    ])
      expect(html).not.toContain(`href="${path}`);
    expect(Object.keys(customerStore.getState())).toEqual([
      'preference',
      'connectors',
    ]);
  });
  it('submits no client price, tenant mapping, native token or cached credentials', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ url: 'merchant' }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);
    await customerRequest('/billing', {});
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/support-saas/billing',
      expect.objectContaining({
        credentials: 'same-origin',
        redirect: 'error',
        cache: 'no-store',
        body: '{}',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
  it('preserves unauthorized status for the phone-login redirect', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Login required' }), {
          status: 401,
        }),
      ),
    );
    await expect(customerRequest('/workspace')).rejects.toMatchObject({
      status: 401,
    });
    expect(new CustomerApiError(401, 'safe')).toBeInstanceOf(Error);
  });
  it('accepts the fixed merchant URL and refuses credential-bearing or arbitrary navigation', () => {
    const id = '11111111-1111-4111-8111-111111111111';
    const valid = `https://moftkhar.ir/api/payments/support/start?purchase=${id}`;
    expect(paymentDestination(valid)).toBe(valid);
    for (const bad of [
      valid.replace('moftkhar.ir', 'evil.example'),
      valid.replace('/start', '/callback'),
      valid + '&amount=1',
      valid + '#token',
      valid.replace('https://', 'https://user:secret@'),
      'javascript:alert(1)',
    ])
      expect(() => paymentDestination(bad)).toThrow();
  });
});
