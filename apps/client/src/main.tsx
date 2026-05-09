import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import App from './App.tsx';
import { config } from '../config/wagmi.ts';
import { ThirdwebProvider } from 'thirdweb/react';

import './index.css';
import ContractProvider from './context/ContractContext.tsx';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <ContractProvider>
            <App />
          </ContractProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
