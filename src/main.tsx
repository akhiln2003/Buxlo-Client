import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import App from './App' ;
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { injectStore } from './services/axios/axiosInstance';
injectStore(store);

createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    < PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
)
