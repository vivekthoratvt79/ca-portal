import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Loader from './Loader';

const AssignWork = ({ type, id, showModal, closeModal, allServices }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.authData);
  const employees = useSelector((state) => state.employees);
  const managers = useSelector((state) => state.managers);
  const clients = useSelector((state) => state.clients);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [loading, setLoading] = useState(false);

  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;
  const modalDisplay = showModal ? 'block' : 'none hidden';

  const curUser =
    type === 'client'
      ? clients.find(({ _id }) => _id === id)
      : employees.find(({ _id }) => _id === id);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } =
          type === 'client'
            ? await api.getAgentServiceMapforClient(id)
            : await api.getManagerServiceMapForAgent(id);

        const serviceRefs =
          type == 'client'
            ? data?.data?.mapArr.map(({ serviceRef, agentRef }) => ({
                serviceRef,
                agentRef,
              }))
            : data?.data?.mapArr.map(({ serviceRef, managerRef }) => ({
                serviceRef,
                managerRef,
              }));

        const matchedServices = allServices.filter((service) =>
          serviceRefs.some((s) => s.serviceRef === service._id)
        );

        setSelectedServices(matchedServices);

        const initialValues =
          type == 'client'
            ? serviceRefs.reduce((acc, { serviceRef, agentRef }) => {
                acc[serviceRef] = agentRef || '';
                return acc;
              }, {})
            : serviceRefs.reduce((acc, { serviceRef, managerRef }) => {
                acc[serviceRef] = managerRef || '';
                return acc;
              }, {});

        setSelectedValues(initialValues);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id, type, allServices]);

  const handleSelectChange = (event, serviceId) => {
    const employeeId = event.target.value;
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [serviceId]: employeeId,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const taskArray = Object.keys(selectedValues).map((serviceRef) =>
      type === 'client'
        ? {
            serviceRef,
            agentRef: selectedValues[serviceRef],
          }
        : {
            serviceRef,
            managerRef: selectedValues[serviceRef],
          }
    );

    const payload =
      type === 'client'
        ? {
            clientRef: id,
            mapArr: taskArray,
          }
        : {
            agentRef: id,
            mapArr: taskArray,
          };

    try {
      if (type === 'client') {
        await api.assignClientToAgent(payload);
      } else {
        await api.assignAgentToManager(payload);
      }
      closeModal();
    } catch (error) {
      console.error('Error assigning tasks:', error);
    }
  };

  return (
    <div
      className={`fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 ${modalDisplay}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md ${
            smallScreen
              ? 'mobile-modal'
              : 'h-[400px] min-w-[500px] overflow-auto'
          }`}
        >
          <div className='flex justify-between items-center'>
            <div className='text-lg font-bold'>Assign Task</div>
            <div className='cursor-pointer text-lg' onClick={closeModal}>
              x
            </div>
          </div>
          <div className='overflow-x-auto px-2 py-4'>
            {curUser && selectedServices.length > 0 ? (
              <>
                <fieldset className='mb-4'>
                  <legend className='text-lg border-b-2 font-semibold mb-4'>
                    Services
                  </legend>
                  {selectedServices.map((service) => (
                    <div key={service._id} className='mb-4 flex items-center'>
                      <div className='flex-1'>
                        <span className='font-semibold'>{`${service.heading} (${service.subheading})`}</span>
                        <p className='text-gray-500 italic'>
                          {service.description}
                        </p>
                      </div>
                      <div className='ml-4'>
                        <label
                          htmlFor={`dropdown-${service._id}`}
                          className='sr-only'
                        >
                          {type === 'client'
                            ? 'Select Agent'
                            : 'Select Manager'}
                        </label>
                        <select
                          id={`dropdown-${service._id}`}
                          value={selectedValues[service._id] || ''}
                          onChange={(event) =>
                            handleSelectChange(event, service._id)
                          }
                          className='border border-gray-300 rounded p-2 w-36'
                        >
                          <option value=''>
                            {type === 'client'
                              ? 'Select Agent'
                              : 'Select Manager'}
                          </option>
                          {type === 'client' &&
                            employees
                              .filter((agent) =>
                                agent.serviceRefs.includes(service._id)
                              )
                              .map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.name}
                                </option>
                              ))}
                          {type === 'agent' &&
                            managers.map((manager) => (
                              <option key={manager._id} value={manager._id}>
                                {manager.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </fieldset>
                <div className='flex text-center justify-center'>
                  <button
                    type='submit'
                    onClick={handleSubmit}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <div className='h-[250px] flex items-center justify-center'>
                User not availing any services!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignWork;
