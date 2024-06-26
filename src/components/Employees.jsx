import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddEmployeeModal from './AddEmployeeModal';
import { useDispatch, useSelector } from 'react-redux';
import { getClients } from '../actions/clients';
import { fetchAgentsForManager, getEmployees } from '../actions/employees';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const Employees = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);

  useEffect(() => {
    if (userRole == 'admin') dispatch(fetchForAdmin('manager', entitiyId));
  }, [entitiyId]);

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (userRole == 'admin') {
      dispatch(fetchForAdmin('agent', entitiyId));
    } else {
      dispatch(fetchAgentsForManager(entitiyId));
    }
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
  const employees = useSelector((state) => state.employees);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Sidebar activeTab='employees' />
      <AddEmployeeModal
        showModal={showModal}
        closeModal={closeModal}
        services={services}
      />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Employees</div>
          <div
            className='p-2 bg-green-300 hover:bg-green-400 cursor-pointer rounded-md text-xs'
            onClick={openModal}
          >
            Add Employees
          </div>
        </div>
        {!employees.length ? (
          <div className='p-4'>No Employees Yet</div>
        ) : (
          <div className='p-4'>
            {employees && employees.length > 0 && (
              <TableComponent
                headers={['Sr No.', 'Name', 'Email', 'Number']}
                data={employees}
                type='agent'
                allServices={services}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Employees;
