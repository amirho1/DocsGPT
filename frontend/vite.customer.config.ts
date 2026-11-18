import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';

/** Builds the customer entry with upstream components, without the management entry or its auth bootstrap. */
export default defineConfig((context) =>
  mergeConfig(
    typeof baseConfig === 'function' ? baseConfig(context) : baseConfig,
    {
      base: '/support-panel/',
      build: {
        outDir: 'dist-customer',
        sourcemap: false,
        rolldownOptions: { input: 'customer.html' },
      },
    },
  ),
);
