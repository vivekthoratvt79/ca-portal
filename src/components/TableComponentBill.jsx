import React, { useState } from 'react';
import ViewDetailsModal from './ViewDetailsModal';
import AssignWork from './AssignWork';
import InvoiceModal from './InvoiceModal';
import InvoiceForm from './InvoiceForm';
import Loader from './Loader';
import * as api from '../api';
import ReceiptModal from './ReceiptModal';

const TableComponentBill = ({ headers, data, setRefresh, stage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [receiptData, setReceiptData] = useState({});
  const [paidAmount, setPaidAmount] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const keyMap = {
    'Sr No.': 'index',
    'Client Name': 'clientName',
    Details: 'billDetails',
    Discount: 'discount',
    'Final Amount': 'finalAmount',
    Edit: 'edit',
    Invoice: 'invoice',
    'Pending Amount': 'pendingAmount',
    Payment: 'payment',
    'Received Amount': 'receivedAmount',
    Receipt: 'receipt',
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openReceiptModal = () => {
    setShowReceiptModal(true);
  };
  const closeReceiptModal = () => {
    setShowReceiptModal(false);
  };

  const viewInvoiceModal = (rowIndex, rowData) => {
    setInvoiceData(rowData);
    openModal();
  };

  const viewEditModal = (rowIndex, rowData) => {
    setInvoiceData(rowData);
    openEditModal();
  };

  const viewReceiptModal = (rowIndex, rowData) => {
    setReceiptData(rowData);
    openReceiptModal();
  };

  const resetInvoiceData = () => {
    setInvoiceData({});
  };

  const handlePaymentChange = (rowIndex, value) => {
    setPaymentErrors({ [rowIndex]: '' });
    setPaidAmount((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handlePaymentDone = async (rowIndex, rowData, e) => {
    if (!paidAmount[rowIndex]) {
      setPaymentErrors({ [rowIndex]: 'Amount is required' });
      return;
    }
    if (paidAmount[rowIndex] > rowData.pendingAmount) {
      setPaymentErrors({
        [rowIndex]: 'Amount cannot be greater than pending amount',
      });
      return;
    }
    e.target.innerText = 'Updating...';
    const payload = {};
    payload.billRef = rowData._id;
    payload.paidAmount = paidAmount[rowIndex];

    try {
      api.updateInPendingStage(payload).then(({ data }) => {
        if (data.statusCode == '200') {
          setLoading(false);
          e.target.innerText = 'Updated';
        } else {
          e.target.innerText = 'Try Later';
        }
      });
      setTimeout(() => {
        setLoading(false);
        e.target.innerText = 'Received';
        setRefresh(Date.now() + Math.random());
      }, 4000);
    } catch (error) {
      setLoading(false);
      e.target.innerText = 'Received';
      setRefresh(Date.now() + Math.random());
      console.error('Error :', error);
    }
  };

  data = stage == 'bills' ? data : { bills: data };

  return !data?.bills?.length ? (
    <div className='overflow-x-auto max-h-[575px]'>
      <table className='table-auto w-full border-collapse'>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {headers.map((header, index) => (
              <td
                key={index}
                className={`px-4 py-2 border border-gray-300 text-center`}
              >
                -
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <>
      <InvoiceForm
        showModal={showEditModal}
        closeModal={() => {
          closeEditModal();
          resetInvoiceData();
        }}
        invoiceData={invoiceData}
        adminData={data.admin}
        setRefresh={setRefresh}
      />
      <InvoiceModal
        showModal={showModal}
        closeModal={closeModal}
        invoiceData={invoiceData}
        adminData={data.admin}
      />
      <ReceiptModal
        showModal={showReceiptModal}
        closeModal={closeReceiptModal}
        receiptData={receiptData}
        adminData={data.admin}
      />
      <div className='overflow-x-auto max-h-[575px]'>
        <table className='table-auto w-full border-collapse'>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.bills.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => {
                  const cellData =
                    header === 'Sr No.'
                      ? rowIndex + 1
                      : rowData[keyMap[header]];
                  return (
                    <td
                      key={cellIndex}
                      className='px-4 py-2 border border-gray-300 text-center'
                    >
                      {header === 'Details' ? (
                        cellData.map((item, index) => (
                          <div key={index} className='whitespace-nowrap'>
                            {item.particular}
                          </div>
                        ))
                      ) : header === 'Invoice' ? (
                        <>
                          <button
                            onClick={(e) => viewInvoiceModal(rowIndex, rowData)}
                            className='ml-2 text-sm px-2 py-1 text-white rounded '
                          >
                            <svg
                              className='w-6 h-6 text-gray-800 dark:text-white'
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              fill='none'
                              viewBox='0 0 24 24'
                            >
                              <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 12v6h8v-6H8Z'
                              />
                            </svg>
                          </button>
                        </>
                      ) : header === 'Edit' ? (
                        <button
                          onClick={(e) => viewEditModal(rowIndex, rowData)}
                          className='ml-2 text-sm px-2 py-1 text-white rounded '
                        >
                          <svg
                            className='w-6 h-6 text-gray-800 dark:text-white'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z'
                            />
                          </svg>
                        </button>
                      ) : header == 'Payment' ? (
                        <div className='flex items-center gap-1'>
                          <input
                            className={`w-[100px] p-2 rounded-r-none bg-white shadow-sm  ${
                              paymentErrors[rowIndex]
                                ? 'border border-red-500'
                                : ''
                            }`}
                            type='number'
                            name='paidAmount'
                            id='paidAmount'
                            placeholder='0'
                            value={paidAmount[rowIndex] || ''}
                            onChange={(e) =>
                              handlePaymentChange(rowIndex, e.target.value)
                            }
                          />
                          <button
                            onClick={(e) =>
                              handlePaymentDone(rowIndex, rowData, e)
                            }
                            className='text-sm ml-2 px-4 py-1 bg-blue-500 text-white rounded'
                          >
                            Received
                          </button>
                        </div>
                      ) : header == 'Receipt' ? (
                        <button
                          onClick={(e) => viewReceiptModal(rowIndex, rowData)}
                          className='ml-2 text-sm px-2 py-1 text-white rounded '
                        >
                          <svg
                            className='w-6 h-6 text-gray-800 dark:text-white'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <path
                              stroke='currentColor'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z'
                            />
                          </svg>
                        </button>
                      ) : (
                        cellData
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableComponentBill;
