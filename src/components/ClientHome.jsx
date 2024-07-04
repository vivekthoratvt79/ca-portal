import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddClientModal from './AddClientModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const ClientHome = ({ access }) => {
  const dispatch = useDispatch();
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const userData = useSelector((state) => state.auth.authData);
  const [services, setServices] = useState([]);

  useEffect(() => {}, [dispatch]);

  return (
    <>
      <div className='p-4 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>
            Welcome, <span className='text-blue-400'>{userData.username}</span>
          </div>
        </div>

        <div className='p-4'>Client Data</div>
      </div>
    </>
  );
};

export default ClientHome;
