import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AddEmployeeModal from './AddEmployeeModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentsForManager, getEmployees } from '../actions/employees';
import { fetchForAdmin } from '../actions/managers';
import TableComponent from './TableComponent';
import * as api from '../api';

const Employees = ({ access }) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.authData.role);
  const user = useSelector((state) => state.auth.authData);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const userId = useSelector((state) => state.auth.authData.userid);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (userRole == 'admin' || userRole == 'manager' || userRole == 'agent') {
      let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;
      dispatch(fetchForAdmin('manager', id));
    }
  }, [entitiyId, refresh]);

  const [services, setServices] = useState([]);

  useEffect(() => {
    if (userRole == 'admin' || userRole == 'manager' || userRole == 'agent') {
      let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;

      dispatch(fetchForAdmin('agent', id));
    }
    // else if (userRole == 'manager') {
    // dispatch(fetchAgentsForManager(entitiyId));
    // }
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, refresh]);
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
      <Sidebar activeTab='employees' access={access} />
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
            {employees && employees.length > 0 && (
              <TableComponent
                headers={['Sr No.', 'Name', 'Email', 'Number']}
                data={employees}
                type='agent'
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

export default Employees;
