import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { ThemeProvider } from 'styled-components';

import { theme } from './themes/index.jsx';
import styleAntd from './assets/style/styleAntd.json';
import { persistor, store } from './store/store.jsx';
import { router } from './routes/routes.jsx';
import { GlobalStyle } from './assets/style/globalStyle.jsx';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <ConfigProvider locale={ptBR} theme={styleAntd} wave={{ disabled: true, showEffect: false }}>
      <QueryClientProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={<p>Carregando...</p>} persistor={persistor}>
            <GlobalStyle />
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ConfigProvider>
  </ThemeProvider>,
);
