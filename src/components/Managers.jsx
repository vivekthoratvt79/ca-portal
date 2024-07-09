import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForAdmin, getManagers } from '../actions/managers';
import AddManagerModal from './AddManagerModal';
import TableComponent from './TableComponent';
import * as api from '../api';
import { fetchAgentsForManager } from '../actions/employees';

const Managers = ({ access }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.authData.role);
  const user = useSelector((state) => state.auth.authData);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (userRole == 'admin' || userRole == 'manager') {
      let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;
      dispatch(fetchForAdmin('manager', id));
    }
  }, [entitiyId]);

  useEffect(() => {
    let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;
    if (userRole == 'admin' || userRole == 'manager' || userRole == 'agent') {
      dispatch(fetchForAdmin('agent', id));
    }
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
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
      <Sidebar activeTab='managers' access={access} />
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
                allServices={services}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Managers;
