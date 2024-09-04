import {ethers} from 'ethers';
import { contractAddress,contractABI } from './config';

function Ethers() {
    if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      // console.log(ethers.providers)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      return { provider,signer, contract };
}

export default Ethers