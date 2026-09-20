import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { DestinationProvider } from './i18n/DestinationContext.jsx';
import { NationalityProvider } from './i18n/NationalityContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <NationalityProvider>
        <DestinationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DestinationProvider>
      </NationalityProvider>
    </LanguageProvider>
  </React.StrictMode>
);
