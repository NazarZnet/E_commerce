import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./assets/fonts/Liter-Regular.ttf";
import App from './App.tsx'
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.ts';
import "./i18n/config.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </PersistGate>

    </Provider>
  </StrictMode>,
)
