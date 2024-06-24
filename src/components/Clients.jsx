import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent, getClients } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const Clients = () => {
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (userRole == 'admin') {
      dispatch(fetchForAdmin('client', entitiyId));
      dispatch(fetchForAdmin('agent', entitiyId));
    } else if (userRole == 'agent') {
      dispatch(fetchClientsForAgent(entitiyId));
    }
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  const clients = useSelector((state) => state.clients);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Sidebar activeTab='clients' />
      <AddClientModal
        showModal={showModal}
        services={services}
        closeModal={closeModal}
      />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Clients</div>
          <div
            className='p-2 bg-green-300 hover:bg-green-400 cursor-pointer rounded-md text-xs'
            onClick={openModal}
          >
            Add Client
          </div>
        </div>
        {!clients.length ? (
          <div className='p-4'>No Clients Yet</div>
        ) : (
          <div className='p-4'>
            {clients && clients.length > 0 && (
              <TableComponent
                headers={['Sr No.', 'Name', 'Email', 'Number']}
                data={clients}
                type='client'
                allServices={services}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Clients;
