import React from 'react'
import "../stylesheets/Header.css"

function Header({ connectWallet, walletAddress }) {
  return (
    <header className="header">
      <div className="logo">Faucet</div>
      <button 
        onClick={connectWallet} 
        className={`wallet-btn ${walletAddress ? 'connected' : 'not-connected'}`}
      >
        {walletAddress ? walletAddress : 'Connect Wallet'}
      </button>
    </header>
  )
}

export default Header
