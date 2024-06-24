import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForAdmin, getManagers } from '../actions/managers';
import AddManagerModal from './AddManagerModal';
import TableComponent from './TableComponent';

const Managers = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);

  useEffect(() => {
    if (userRole == 'admin') dispatch(fetchForAdmin('manager', entitiyId));
  }, [entitiyId]);
  const managers = useSelector((state) => state.managers);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Sidebar activeTab='managers' />
      <AddManagerModal showModal={showModal} closeModal={closeModal} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Managers</div>
          <div
            className='p-2 bg-green-300 hover:bg-green-400 cursor-pointer rounded-md text-xs'
            onClick={openModal}
          >
            Add Manager
          </div>
        </div>
        {!managers.length ? (
          <div className='p-4'>No Managers Yet</div>
        ) : (
          <div className='p-4'>
            {managers && managers.length > 0 && (
              <TableComponent
                headers={['Sr No.', 'Name', 'Email', 'Number']}
                data={managers}
                type='manager'
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Managers;
