import React, { useState } from 'react';
import ViewDetailsModal from './ViewDetailsModal';
import AssignWork from './AssignWork';
import InvoiceModal from './InvoiceModal';

const TableComponentBill = ({ headers, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const keyMap = {
    'Sr No.': 'index',
    Name: 'name',
    'Bill Amount': 'bill_amount',
    'View Invoice': 'invoice',
    Discount: 'discount',
    Status: 'status',
  };

  const viewInvoiceModal = (rowIndex, rowData) => {
    console.log('open invoice modal');
    setIsOpen(true);
  };

  return (
    <>
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
            {data.map((rowData, rowIndex) => (
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
                      {header === 'View Invoice' ? (
                        <>
                          <button
                            onClick={() => viewInvoiceModal(rowIndex, rowData)}
                            className='ml-2 text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                          >
                            Invoice
                          </button>
                          <InvoiceModal isOpen={isOpen} setIsOpen={setIsOpen} />
                        </>
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
