import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { SoundProvider } from './hooks/useSound.jsx';
import { ChaosProvider } from './hooks/useChaos.jsx';
import { CartProvider } from './hooks/useCart.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <ToastProvider>
        <ChaosProvider>
          <CartProvider>
            <AuthProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </AuthProvider>
          </CartProvider>
        </ChaosProvider>
      </ToastProvider>
    </SoundProvider>
  </StrictMode>,
);
