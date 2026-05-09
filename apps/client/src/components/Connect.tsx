import { ConnectButton } from 'thirdweb/react';
import { createThirdwebClient, defineChain } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { lightTheme } from 'thirdweb/react';
import { useContract } from '../context/ContractContext';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
if (!clientId) {
  throw new Error('Missing THIRDWEB_CLIENT_ID in environment variables');
}

export const client = createThirdwebClient({
  clientId: clientId, 
});

export const wallets = [
  createWallet('io.metamask'),
  createWallet('io.rabby'),
  createWallet('app.phantom'),
];

export const theme = lightTheme({
  colors: {
    accentButtonBg: '#ffffff',
    accentButtonText: '#2c2a26',
    accentText: '#2c2a26',
    danger: '#c44040',
    inputAutofillBg: '#e9e6e0',
    modalBg: '#ffffff',
    primaryButtonBg: '#ffffff',
    primaryButtonText: '#2c2a26',
    primaryText: '#2c2a26',
    scrollbarBg: '#d1cdc5',
    secondaryButtonBg: '#e9e6e0',
    secondaryButtonHoverBg: '#dddad3',
    secondaryButtonText: '#2c2a26',
    secondaryIconColor: '#2c2a26',
    secondaryIconHoverBg: '#dddad3',
    secondaryIconHoverColor: '#2c2a26',
    secondaryText: '#6b665c',
    selectedTextBg: '#2c2a26',
    selectedTextColor: '#ffffff',
    separatorLine: '#d1cdc5',
    skeletonBg: '#e9e6e0',
    success: '#3ea87a',
    tertiaryBg: '#f2f0eb',
    tooltipBg: '#2c2a26',
    tooltipText: '#ffffff',
  },
  fontFamily: 'Inter, sans-serif',
});

const buttonStyles = {
  className: 'connect-btn',
  style: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    height: '42px',
    width: '130px',
    minWidth: 'fit-content',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
};

function Connect() {
  const { selectedChainId } = useContract();

  return (
    <ConnectButton
      connectButton={buttonStyles}
      switchButton={{ label: 'Switch Chain', ...buttonStyles }}
      theme={theme}
      detailsModal={{
        hideBuyFunds: true,
        hideReceiveFunds: true,
        hideSendFunds: true,
        assetTabs: [],
      }}
      detailsButton={{
        style: {
          ...buttonStyles.style,
          minHeight: 'fit-content',
        },
      }}
      connectModal={{ size: 'compact' }}
      client={client}
      wallets={wallets}
      chain={defineChain(selectedChainId)}
    />
  );}

export default Connect;
