import React, { useState, useEffect } from 'react';
import "../stylesheets/TokenRequest.css";
import NetworkSwitcher from './NetworkSwitcher';
import Ethers from '../utils/Ethers';
import { ethers } from 'ethers';

function TokenRequest({ requestTokens, viewTransactions, MetamaskWalletAddress, clearMetamask }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    // Clear the error message after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer); // Clear timeout if the component unmounts
    }
  }, [error]);

  const validateInputs = () => {
    if (!MetamaskWalletAddress) {
      if (!walletAddress) {
        setError('Wallet address is required.');
        return false;
      }

      if (!/^(0x)?[0-9a-fA-F]{40}$/.test(walletAddress)) {
        setError('Invalid wallet address.');
        return false;
      }
    }

    setError('');
    return true;
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setCurrentNetwork(network.chainId);
        return network.chainId;
      } catch (error) {
        console.error('Error fetching network:', error);
        return null;
      }
    }
    return null;
  };

  const handleRequest = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const selectedNetwork = await checkNetwork();

      // Check if the current network is Sepolia (chainId: 0xAA36A7)
      if (selectedNetwork !== 0xAA36A7) {
        setError('Please switch to the Sepolia network to request tokens.');
        return;
      }

      const { signer, contract } = Ethers();

      if (typeof contract.timeUntilNextRequest !== 'function') {
        console.error("Contract does not have timeUntilNextRequest method");
        return;
      }

      // Fetch the remaining time until the next request
      const remainingTime = await contract.timeUntilNextRequest(signer.getAddress());

      if (remainingTime > 0) {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        const timeString = `${hours}h ${minutes}m ${seconds}s`;
        setError(`You need to wait ${timeString} before requesting again.`);
        return;
      }

      await requestTokens(walletAddress);
    } catch (e) {
      setError('Failed to request tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
    if (error) setError(''); // Clear error when the user interacts with the input
  };

  const removeMetamaskWallet = () => {
    clearMetamask();
    setWalletAddress('');
  }

  return (
    <div className='token-request'>
      <h2>Request GSMC Test Tokens</h2>

      {error && <p className='error-message'>{error}</p>}

      {MetamaskWalletAddress ? (
        <>
          <p className='wallet-address'>Wallet Address: {MetamaskWalletAddress}</p>
          <div className='differentWalletCont'>
            <button onClick={removeMetamaskWallet} className='addDifferentWallet'>Add a different wallet</button>
          </div>
        </>
      ) : (
        <div className="input-container">
          <input
            type="text"
            id="walletAddress"
            placeholder=''
            value={walletAddress}
            onChange={handleWalletAddressChange}
            required
          />
          <label htmlFor="walletAddress">Enter wallet address</label>
        </div>
      )}

      <div className='button-grp'>
        <button onClick={handleRequest} disabled={loading} className='get-tokens'>
          {loading ? 'Requesting...' : 'Get Tokens'}
        </button>
        {MetamaskWalletAddress && (
          <>
            <button onClick={viewTransactions} className='view-transactions'>
              View my Transactions
            </button>   
            <NetworkSwitcher />
          </>
        )}
      </div>
    </div>
  );
}

export default TokenRequest;
