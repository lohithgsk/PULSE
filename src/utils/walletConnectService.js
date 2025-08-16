import { ethers, formatEther } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';

let wcProvider = null;

export async function connectWithWalletConnect() {
	const projectId = import.meta.env?.VITE_WALLETCONNECT_PROJECT_ID;
	if (!projectId) {
		throw new Error('WalletConnect project ID missing. Set VITE_WALLETCONNECT_PROJECT_ID in your env.');
	}

	wcProvider = await EthereumProvider.init({
		projectId,
		chains: [11155111],
		showQrModal: true,
	});

	await wcProvider.connect();

	const accounts = wcProvider.accounts || [];
	const address = accounts[0];
	if (!address) {
		throw new Error('No account returned from WalletConnect.');
	}

	const provider = new ethers.BrowserProvider(wcProvider);
	const network = await provider.getNetwork();
	const balance = await provider.getBalance(address);

	return {
		address,
		balance: formatEther(balance),
		network: network?.name,
		chainId: network?.chainId?.toString(),
		did: `did:ethr:${address}`,
		type: 'WalletConnect',
	};
}

export async function disconnectWalletConnect() {
	try {
		if (wcProvider) {
			await wcProvider.disconnect();
		}
	} catch (_) {
		// ignore
	} finally {
		wcProvider = null;
	}
}

export function isWalletConnectActive() {
	return !!wcProvider;
}

