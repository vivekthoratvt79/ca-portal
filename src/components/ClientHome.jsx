import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';
import InvoiceModal from './InvoiceModal';
import ReceiptModal from './ReceiptModal';

const ClientHome = ({ access }) => {
  const dispatch = useDispatch();
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const userData = useSelector((state) => state.auth.authData);
  const [services, setServices] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [completeBills, setCompleteBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState({});
  const [receiptData, setReceiptData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  let uploadHeaders = ['Service', 'Upload'];
  let pendingBillsHeaders = ['Service', 'Invoice', 'Pending Amount'];
  let completedBillsHeaders = ['Service', 'Receipt', 'Amount'];

  const keyMap = {
    'Sr No.': 'index',
    'Client Name': 'clientName',
    Details: 'billDetails',
    Discount: 'discount',
    'Final Amount': 'finalAmount',
    Edit: 'edit',
    Invoice: 'invoice',
    Reminder: 'reminder',
    'Pending Amount': 'pendingAmount',
    Payment: 'payment',
    'Received Amount': 'receivedAmount',
    Receipt: 'receipt',
    Service: 'serviceRef',
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    api.fetchAllServices().then(({ data }) => {
      data.statusCode == 200 && setServices(data.data.services);
    });
    api.getClientBillsInPendingStage(entitiyId).then(({ data }) => {
      setLoading(false);
      setPendingBills(data.data.bills);
      console.log(data.data.bills);
    });
  }, [dispatch]);

  const viewInvoiceModal = (rowIndex, rowData) => {
    setInvoiceData(rowData);
    openModal();
  };

  const viewReceiptModal = (rowIndex, rowData) => {
    setReceiptData(rowData);
    openReceiptModal();
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
  };

  const getServiceName = (serviceRef) => {
    const service = services.find((service) => service._id === serviceRef);
    return service && service.heading != service.subheading
      ? `${service.heading} ${service.subheading}`
      : service
      ? service.subheading
      : 'Unknown Service';
  };

  return (
    <>
      {pendingBills.length > 0 && (
        <InvoiceModal
          showModal={showModal}
          closeModal={closeModal}
          invoiceData={invoiceData}
        />
      )}
      {completeBills.length > 0 && (
        <ReceiptModal
          showModal={showReceiptModal}
          closeModal={closeReceiptModal}
          receiptData={receiptData}
        />
      )}
      <div className='p-4 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>
            Welcome,{' '}
            <span className='text-blue-400'>
              {userData?.entity?.name || userData.username}
            </span>
          </div>
        </div>

        <div className='p-4'>
          <div className='upload-container'>
            <h2 className='font-bold mb-2'>Data Upload</h2>
            <table className='table-auto w-full border-collapse'>
              <thead>
                <tr>
                  {uploadHeaders.map((header, index) => (
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
                  {uploadHeaders.map((header, index) => (
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
          <div className='container flex justify-center gap-4 mt-8 min-w-full'>
            <div className='w-1/2'>
              <h2 className='font-bold mb-2'>Pending Bills</h2>
              <table className='table-auto w-full border-collapse'>
                <thead>
                  <tr>
                    {pendingBillsHeaders.map((header, index) => (
                      <th
                        key={index}
                        className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {!pendingBills.length ? (
                  <tbody>
                    <tr>
                      {pendingBillsHeaders.map((header, index) => (
                        <td
                          key={index}
                          className={`px-4 py-2 border border-gray-300 text-center`}
                        >
                          -
                        </td>
                      ))}
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {pendingBills.map((rowData, rowIndex) => (
                      <tr key={rowIndex}>
                        {pendingBillsHeaders.map((header, cellIndex) => {
                          const cellData = rowData[keyMap[header]] || '-';

                          return (
                            <td
                              key={cellIndex}
                              className='px-4 py-2 border border-gray-300 text-center'
                            >
                              {header === 'Invoice' ? (
                                <>
                                  <button
                                    onClick={(e) =>
                                      viewInvoiceModal(rowIndex, rowData)
                                    }
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
                              ) : header == 'Service' ? (
                                getServiceName(cellData)
                              ) : (
                                cellData
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            <div className='w-1/2'>
              <h2 className='font-bold mb-2'>Receipts</h2>
              <table className='table-auto w-full border-collapse'>
                <thead>
                  <tr>
                    {completedBillsHeaders.map((header, index) => (
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
                    {completedBillsHeaders.map((header, index) => (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientHome;
