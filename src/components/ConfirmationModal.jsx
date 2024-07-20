import React from 'react';

const ConfirmationModal = ({ showModal, closeModal, onConfirm }) => {
  if (!showModal) return null;

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-4 rounded shadow-lg'>
        <h2 className='text-lg font-semibold mb-4'>Confirm Payment</h2>
        <p>Are you sure you want to proceed with the payment?</p>
        <div className='mt-4 flex justify-end space-x-2'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded'
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
