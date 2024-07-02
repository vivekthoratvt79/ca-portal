import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import TableComponentBill from './TableComponentBill';
import * as api from '../api';

const Income = ({ access }) => {
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    function fetchBills() {
      try {
        let payload = {};
        api.getAllBillsOfAdmin(payload).then((data) => console.log(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [entitiyId, userRole]);
  return (
    <>
      <Sidebar activeTab='income' access={access} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Income</div>
        </div>
        {!bills.length ? (
          <div className='p-4'>No Bills Generated Yet!</div>
        ) : (
          <div className='p-4'>
            {bills && bills.length > 0 && (
              <TableComponentBill
                headers={[
                  'Sr No.',
                  'Name',
                  'Bill Amount',
                  'Discount',
                  'Status',
                ]}
                data={bills}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Income;
