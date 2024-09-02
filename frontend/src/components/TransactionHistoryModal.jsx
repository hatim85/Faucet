import React from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'
import "../stylesheets/TransactionHistoryModal.css"

function TransactionHistoryModal({ isOpen, onClose, transactions }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <div className='transaction-header'>
        <h2>Your Transaction History</h2>
        <button onClick={onClose}>
          <FaTimes/>
        </button>
      </div>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <span>{tx.date}</span>
            <span>{tx.amount} tokens</span>
            {tx.status === 'success' ? (
              <a href={tx.hashLink} target='_blank' rel='noopener noreferrer'>
                {tx.hash}
              </a>
            ) : (
              <span className="status">Failed</span>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default TransactionHistoryModal
