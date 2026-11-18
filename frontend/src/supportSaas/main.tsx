import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import i18n from '@/locale/i18n';
import LocaleDirection from '@/locale/LocaleDirection';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarLevelProvider } from '@/navigation/SidebarLevelProvider';
import { installChunkReload } from '@/utils/chunkReload';
import { installTranslatorGuard } from '@/utils/translatorGuard';
import '@/index.css';
import './customerFonts.css';
import CustomerApp from './customerApp';
import customerStore from './customerStore';

installChunkReload();
installTranslatorGuard();
void i18n.changeLanguage('fa').then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter basename="/panel">
        <Provider store={customerStore}>
          <LocaleDirection>
            <TooltipProvider>
              <SidebarLevelProvider>
                <CustomerApp />
              </SidebarLevelProvider>
            </TooltipProvider>
          </LocaleDirection>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>,
  );
});
