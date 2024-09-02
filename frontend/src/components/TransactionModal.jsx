import React from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa' // Import the cross icon from react-icons
import "../stylesheets/TransactionModal.css"

function TransactionModal({ isOpen, onClose, transactionDetails }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
    // overlayClassName="overlay" // Optional: to style the overlay
    >
      <div className='transaction-header'>
        <h2>Transaction Status</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      {console.log(transactionDetails)}
      {transactionDetails ? (
        <>
          <p>{transactionDetails.message}</p>
          <p>Amount: {transactionDetails.amount}</p>
          {transactionDetails.message=="Transaction success!" && (
            <p>
              Transaction Hash: <a href={transactionDetails.hashLink} target="_blank" rel="noopener noreferrer">{transactionDetails.hash}</a>
            </p>
          )}
        </>
      ) : (
       <>No previous transactions</>
      )
    }
    </Modal>
  )
}

export default TransactionModal
