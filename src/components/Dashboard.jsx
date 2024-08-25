import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const Dashboard = () => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.authData);
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [services, setServices] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 7;

  useEffect(() => {
    if (userRole === 'admin') {
      dispatch(fetchForAdmin('client', entitiyId));
      dispatch(fetchForAdmin('agent', entitiyId));
    } else if (userRole === 'agent') {
      dispatch(fetchClientsForAgent(entitiyId));
    } else if (userRole === 'manager') {
      dispatch(fetchForAdmin('client', user.entity.adminRef));
      dispatch(fetchForAdmin('agent', user.entity.adminRef));
    }
    try {
      api.fetchAllServices().then(({ data }) => {
        if (data.statusCode === 200) {
          setServices(data.data.services);
        }
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

  // Filter and paginate clients
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <AddClientModal
        showModal={showModal}
        services={services}
        closeModal={closeModal}
        setRefresh={setRefresh}
      />

      <div
        className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
        style={{ borderColor: '#41506b' }}
      >
        <div>Clients</div>
        <input
          type='text'
          placeholder='Search by client name'
          className='border p-2 rounded-md'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!currentClients.length ? (
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
          <TableComponent
            headers={['Sr No.', 'Name', 'Email', 'Number']}
            data={currentClients}
            type='client'
            allServices={services}
            setRefresh={setRefresh}
            page='dashboard'
          />
          <div className='flex justify-center mt-4'>
            {[
              ...Array(
                Math.ceil(filteredClients.length / clientsPerPage)
              ).keys(),
            ].map((number) => (
              <button
                key={number}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === number + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
