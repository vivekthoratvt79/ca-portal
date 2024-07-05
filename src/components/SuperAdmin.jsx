import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';
import AddAdminModal from './AddAdminModal';

const SuperAdmin = ({ access }) => {
  const dispatch = useDispatch();
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const userData = useSelector((state) => state.auth.authData);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <AddAdminModal
        showModal={showModal}
        services={services}
        closeModal={closeModal}
      />
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
          <div
            className='p-2 bg-green-300 hover:bg-green-400 cursor-pointer rounded-md text-xs'
            onClick={openModal}
          >
            Register Admin
          </div>
        </div>

        <div className='p-4'></div>
      </div>
    </>
  );
};

export default SuperAdmin;
