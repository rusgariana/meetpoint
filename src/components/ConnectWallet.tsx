'use client';

import { useEffect, useState } from 'react';
import { sepolia } from 'viem/chains';
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address, chainId: sepolia.id });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName!, chainId: sepolia.id });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
                Connect Wallet
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
                {ensAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ensAvatar} alt="ENS Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                )}
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                </div>
                <button
                    onClick={() => disconnect()}
                    className="ml-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: injected() })}
            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
            Connect Wallet
        </button>
    );
}
