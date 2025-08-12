import React from 'react';
import { node } from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import { theme } from '../../src/themes';
import { store } from '../../src/store/store';
import styleAntd from '../../src/assets/style/styleAntd.json';

const TestWrapper = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider locale={ptBR} theme={styleAntd} wave={{ disabled: true, showEffect: false }}>
        <Provider store={store}>
          <Router>{children}</Router>
        </Provider>
      </ConfigProvider>
    </ThemeProvider>
  );
};
TestWrapper.propTypes = {
  children: node.isRequired,
};
export default TestWrapper;
