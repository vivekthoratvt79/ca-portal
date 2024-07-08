import React from 'react';
import InvoiceField from './InvoiceField';

const InvoiceItem = ({
  _id,
  particular,
  hsn,
  amount,
  onDeleteItem,
  onEdtiItem,
}) => {
  const deleteItemHandler = () => {
    onDeleteItem(_id);
  };

  const handleEdit = (event) => {
    const { name, value } = event.target;
    onEdtiItem(_id, name, value);
  };

  return (
    <tr>
      <td className='w-full'>
        <InvoiceField
          onEditItem={handleEdit}
          cellData={{
            placeholder: 'Service name',
            type: 'text',
            name: 'particular',
            id: _id,
            value: particular,
          }}
        />
      </td>
      <td className=''>
        <InvoiceField
          onEditItem={handleEdit}
          cellData={{
            type: 'text',
            min: '1',
            name: 'hsn',
            id: _id,
            value: hsn,
          }}
        />
      </td>
      <td className='relative w-[50px]'>
        <InvoiceField
          onEditItem={handleEdit}
          cellData={{
            className: 'text-center',
            type: 'number',
            name: 'amount',
            id: _id,
            value: amount,
          }}
        />
      </td>
      <td className='flex items-center justify-center'>
        <button
          className='rounded-md bg-red-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-red-600'
          onClick={deleteItemHandler}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
