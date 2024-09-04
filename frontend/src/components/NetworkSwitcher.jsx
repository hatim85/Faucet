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
      checkNetwork();
    };
  }, []);

  const switchToSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xAA36A7' }], 
        });
      } catch (error) {
        // If the error code indicates that the network hasn't been added yet, add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xAA36A7',
                  chainName: 'Sepolia Test Network',
                  rpcUrls: [import.meta.env.VITE_ALCHEMY_URL],
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding Sepolia network:', addError);
          }
        } else {
          console.error('Error switching network:', error);
        }
      }
    } else {
      console.error('Ethereum object not found, make sure you have MetaMask installed.');
    }
  };
  
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  };

  const switchButton = {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width:'100%',
    marginTop:'10px'
  };

  return (
    <div style={containerStyle}>
      {/* {console.log(currentNetwork)} */}
      {currentNetwork && currentNetwork !== 0xAA36A7 && (
        <button onClick={switchToSepolia} style={switchButton}>
          Switch to Sepolia Network
        </button>
      )}
    </div>
  );
};

export default NetworkSwitcher;

