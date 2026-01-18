import React from 'react';
import ConfigRoutes from './routes/mainroutes';
import { ContextProvider } from "./component/contexts/ContextProvider"
import { registerLicense } from '@syncfusion/ej2-base';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/theme/theme';
import 'antd/dist/reset.css';
import { message } from 'antd';

message.config({
  top: 80,
  duration: 2,
  maxCount: 3,
});

registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cWWFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXdedXVUQmNZUER2XkJWYEk=');

const App: React.FC = () => {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <ConfigRoutes />
      </ThemeProvider>
    </ContextProvider>
  );
};

export default App;