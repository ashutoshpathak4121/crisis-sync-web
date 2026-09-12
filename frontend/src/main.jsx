import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { EmergencyDataProvider } from './context/EmergencyDataContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <EmergencyDataProvider>
              <App />
            </EmergencyDataProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
