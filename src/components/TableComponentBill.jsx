import React, { useState } from 'react';
import ViewDetailsModal from './ViewDetailsModal';
import AssignWork from './AssignWork';

const TableComponentBill = ({ headers, data }) => {
  const keyMap = {
    'Sr No.': 'index',
    Name: 'name',
    'Bill Amount': 'bill_amount',
    Discount: 'discount',
    Status: 'status',
  };

  return (
    <>
      <div className='overflow-x-auto'>
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
                      {cellData}
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
