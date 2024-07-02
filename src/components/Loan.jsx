import React from 'react';
import Sidebar from './Sidebar';

const Loan = ({ access }) => {
  return (
    <>
      <Sidebar activeTab='loan' access={access} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Loan</div>
        </div>
      </div>
    </>
  );
};

export default Loan;
