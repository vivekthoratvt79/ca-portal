import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const Clients = ({ access }) => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.authData);
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [services, setServices] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (userRole == 'admin') {
      dispatch(fetchForAdmin('client', entitiyId));
      dispatch(fetchForAdmin('agent', entitiyId));
    } else if (userRole == 'agent') {
      dispatch(fetchClientsForAgent(entitiyId));
    } else if (userRole == 'manager') {
      dispatch(fetchForAdmin('client', user.entity.adminRef));
      dispatch(fetchForAdmin('agent', user.entity.adminRef));
    }
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, refresh]);

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
      <Sidebar activeTab='clients' access={access} />
      <AddClientModal
        showModal={showModal}
        services={services}
        closeModal={closeModal}
        setRefresh={setRefresh}
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
          <div className='p-4'>
            <div className='overflow-x-auto max-h-[575px]'>
              <table className='table-auto w-full border-collapse'>
                <thead>
                  <tr>
                    {[
                      'Sr No.',
                      'Name',
                      'Email',
                      'Number',
                      'Assign Work',
                      'ViewDetails',
                    ].map((header, index) => (
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
                    {['Sr No.', 'Name', 'Email', 'Number', '', ''].map(
                      (header, index) => (
                        <td
                          key={index}
                          className={`px-4 py-2 border border-gray-300 text-center`}
                        >
                          -
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='p-4'>
            {clients && clients.length > 0 && (
              <TableComponent
                headers={['Sr No.', 'Name', 'Email', 'Number']}
                data={clients}
                type='client'
                allServices={services}
                setRefresh={setRefresh}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Clients;
