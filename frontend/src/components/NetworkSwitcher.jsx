import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NetworkSwitcher = () => {
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          setCurrentNetwork(network.chainId);
        } catch (error) {
          console.error('Error fetching network:', error);
        }
      }
    };

    checkNetwork();
  }, []);

  const switchToSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xAA36A7', // Sepolia network ID in hexadecimal
              chainName: 'Sepolia Test Network',
              rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/0-1AhQ9wGWIiSC_QlmQOJJ-eIEY8l1-r'],
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
      } catch (error) {
        console.error('Error switching network:', error);
      }
    }
  };

  return (
    <>
      {currentNetwork && currentNetwork !== 0xAA36A7 && (
        <button onClick={switchToSepolia}>
          Switch to Sepolia Network
        </button>
      )}
    </>
  );
};

export default NetworkSwitcher;
