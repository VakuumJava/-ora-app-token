/**
 * Global type definitions for blockchain integrations
 */

// MetaMask/Web3 Ethereum Provider
interface EthereumProvider {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isWalletConnect?: boolean;
    
    request: (args: {
        method: string;
        params?: any[];
    }) => Promise<any>;
    
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    
    // Chain management
    chainId?: string;
    networkVersion?: string;
    selectedAddress?: string | null;
}

interface Window {
    ethereum?: EthereumProvider;
}

// Extend existing types
declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export {};
