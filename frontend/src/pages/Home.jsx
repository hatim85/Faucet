import React, { useState, useEffect } from 'react';
import Ethers from '../utils/Ethers';
import { ethers } from 'ethers';
import Header from '../components/Header';
import TokenRequest from '../components/TokenRequest';
import TransactionModal from '../components/TransactionModal';
import TransactionHistoryModal from '../components/TransactionHistoryModal';
import Loading from '../components/Loading';

function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Expiration time in milliseconds (1 day)
  const expirationTime = 24 * 60 * 60 * 1000;


  useEffect(() => {
    const fetchAmount = async () => {
      try {
        // Instead of fetching from the contract, hardcode the fixed amount
        const fixedAmount = ethers.utils.parseUnits('0.5', 'ether');
        setAmount(ethers.utils.formatUnits(fixedAmount, 'ether'));
      } catch (error) {
        console.error("Failed to set amount:", error);
      }
    };

    fetchAmount();
  }, []);

  useEffect(() => {
    const savedWalletAddress = localStorage.getItem('walletAddress');
    const savedTransactions = localStorage.getItem('transactions');
    const savedTimestamp = localStorage.getItem('timestamp');

    if (savedWalletAddress && savedTimestamp && Date.now() - parseInt(savedTimestamp) < expirationTime) {
      setWalletAddress(savedWalletAddress);
    } else {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('timestamp');
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const { signer } = Ethers();
      const address = await signer.getAddress();
      setWalletAddress(address);
      // console.log("Wallet connected:", address);

      localStorage.setItem('walletAddress', address);
      localStorage.setItem('timestamp', Date.now().toString());
    } catch (error) {
      // console.error("Failed to connect wallet:", error);
    }
  };

  const clearMetamask = async () => {
    setWalletAddress('');
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('timestamp')
    // console.log("metamask wallet cleared")
  }

  const requestTokens = async () => {

    if (amount === null) {
      console.error("Amount is not yet fetched from the contract.");
      return;
    }

    setLoading(true);

    try {
      const { signer, contract } = Ethers();

      if (!contract) {
        console.error("Contract is not initialized");
        return;
      }

      if (typeof contract.timeUntilNextRequest !== 'function') {
        console.error("Contract does not have timeUntilNextRequest method");
        return;
      }

      if (typeof contract.requestTokens !== 'function') {
        console.error("Contract does not have requestTokens method");
        return;
      }

      const tx = await contract.requestTokens({
        gasLimit: ethers.utils.hexlify(300000),
      });
      await tx.wait();
      // console.log("Tokens requested!");
      const txHash = tx.hash;

      const newTransaction = {
        date: new Date().toLocaleString(),
        amount,
        hash: txHash,
        hashLink: `https://etherscan.io/tx/${txHash}`,
        status: 'success',
      };

      setTransactionDetails({
        message: 'Transaction successful!',
        amount,
        hash: txHash,
        hashLink: `https://etherscan.io/tx/${txHash}`,
      });

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      setTransactionModalOpen(true);
    } catch (error) {
      console.error("Transaction failed:", error);

      const newTransaction = {
        date: new Date().toLocaleString(),
        amount,
        hash: null,
        hashLink: null,
        status: 'failed',
      };

      setTransactionDetails({
        message: 'Transaction failed!',
        amount,
        hash: null,
        hashLink: null,
      });

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      setTransactionModalOpen(true);
    } finally {
      setLoading(false); // Set loading to false after the transaction is done
    }
  };

  const viewTransactions = () => {
    setHistoryModalOpen(true);
  };

  return (
    <div>
      <Header connectWallet={connectWallet} walletAddress={walletAddress} />
      <TokenRequest requestTokens={requestTokens} viewTransactions={viewTransactions} MetamaskWalletAddress={walletAddress} clearMetamask={clearMetamask} />
      {loading && <Loading />}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        transactionDetails={transactionDetails}
      />
      <TransactionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        transactions={transactions}
      />
    </div>
  );
}

export default Home;
