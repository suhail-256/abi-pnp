import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThirdwebProvider } from 'thirdweb/react';

import './index.css';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
          <App />
      </ThirdwebProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
