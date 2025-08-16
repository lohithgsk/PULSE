import { ethers } from 'ethers';

/**
 * Blockchain service for PULSE health records management
 */
class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.walletAddress = null;
    this.isConnected = false;
  }

  /**
   * Connect to MetaMask wallet
   * @returns {Promise<object>} Connection result with wallet info
   */
  async connectWallet() {
    try {
      if (typeof window?.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });
      
      if (accounts?.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider?.getSigner();
      this.walletAddress = accounts?.[0];
      this.isConnected = true;

      // Get network information
      const network = await this.provider?.getNetwork();
      const balance = await this.provider?.getBalance(this.walletAddress);

      // Generate DID (Decentralized Identifier)
      const did = `did:ethr:${this.walletAddress}`;

      return {
        address: this.walletAddress,
        balance: ethers?.formatEther(balance),
        network: network?.name,
        chainId: network?.chainId?.toString(),
        did: did,
        type: 'MetaMask'
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.walletAddress = null;
    this.isConnected = false;
  }

  /**
   * Switch to Sepolia testnet
   * @returns {Promise<boolean>} Success status
   */
  async switchToSepolia() {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError?.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Sepolia:', switchError);
      return false;
    }
  }

  /**
   * Sign a message for medical record access
   * @param {string} message - Message to sign
   * @returns {Promise<string>} Signed message
   */
  async signMessage(message) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const signature = await this.signer?.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  /**
   * Log access event to blockchain (simulated)
   * @param {Object} accessEvent - Access event data
   * @returns {Promise<string>} Transaction hash
   */
  async logAccessEvent(accessEvent) {
    try {
      // In a real implementation, this would interact with a smart contract
      // For now, we simulate blockchain logging with a mock transaction hash
      const mockTxHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16)?.toString(16)
      )?.join('')}`;

      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Access event logged to blockchain:', {
        event: accessEvent,
        transactionHash: mockTxHash,
        timestamp: new Date()?.toISOString(),
        walletAddress: this.walletAddress
      });

      return mockTxHash;
    } catch (error) {
      console.error('Blockchain logging error:', error);
      throw error;
    }
  }

  /**
   * Generate secure sharing link with NFT-based consent
   * @param {Object} consentData - Consent configuration
   * @returns {Promise<object>} Sharing link and NFT details
   */
  async generateSecureShareLink(consentData) {
    try {
      // Generate unique consent ID
      const consentId = `consent_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      
      // Create expiry timestamp
      const expiryTimestamp = new Date(Date.now() + (consentData.expiryHours * 60 * 60 * 1000));
      
      // Generate mock NFT token ID
      const nftTokenId = Math.floor(Math.random() * 1000000);
      
      // Create secure access link
      const accessLink = `${window.location?.origin}/secure-access/${consentId}`;
      
      // Simulate NFT minting transaction
      const mockTxHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16)?.toString(16)
      )?.join('')}`;

      await new Promise(resolve => setTimeout(resolve, 3000));

      return {
        consentId,
        accessLink,
        nftTokenId,
        expiryTimestamp,
        transactionHash: mockTxHash,
        ipfsHash: `QmX${Math.random()?.toString(36)?.substr(2, 43)}`, // Mock IPFS hash
        permissions: consentData?.permissions,
        allowedProviders: consentData?.allowedProviders || []
      };
    } catch (error) {
      console.error('Secure share link generation error:', error);
      throw error;
    }
  }

  /**
   * Revoke consent and burn NFT
   * @param {string} consentId - Consent ID to revoke
   * @returns {Promise<string>} Transaction hash
   */
  async revokeConsent(consentId) {
    try {
      // Simulate NFT burning transaction
      const mockTxHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16)?.toString(16)
      )?.join('')}`;

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Consent revoked and NFT burned:', {
        consentId,
        transactionHash: mockTxHash,
        timestamp: new Date()?.toISOString(),
        walletAddress: this.walletAddress
      });

      return mockTxHash;
    } catch (error) {
      console.error('Consent revocation error:', error);
      throw error;
    }
  }

  /**
   * Get current network status
   * @returns {Promise<object>} Network information
   */
  async getNetworkStatus() {
    try {
      if (!this.provider) {
        return { connected: false, name: 'Not Connected', chainId: null };
      }

      const network = await this.provider?.getNetwork();
      return {
        connected: true,
        name: network?.name,
        chainId: network?.chainId?.toString(),
        isTestnet: network?.chainId === 11155111n // Sepolia
      };
    } catch (error) {
      console.error('Network status error:', error);
      return { connected: false, name: 'Error', chainId: null };
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;