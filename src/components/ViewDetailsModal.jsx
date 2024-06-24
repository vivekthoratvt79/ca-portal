import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Loader from './Loader';

const ViewDetailsModal = ({ showModal, closeModal, type, id, allServices }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;
  const user = useSelector((state) => state.auth.authData);
  const employees = useSelector((state) => state.employees);
  const clients = useSelector((state) => state.clients);

  // Function to get agent name from Redux store based on agent ID
  const getAgentName = (agentId) => {
    const agent = employees.find((emp) => emp._id === agentId);
    return agent ? agent.name : 'Unknown';
  };

  const formData =
    type === 'client'
      ? clients.find(({ _id }) => _id === id)
      : employees.find(({ _id }) => _id === id);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let { data } =
          type === 'client'
            ? await api.getAgentServiceMapforClient(id)
            : await api.getManagerServiceMapForAgent(id);

        const serviceRefs = data?.data?.mapArr.map(
          ({ serviceRef, agentRef }) => ({
            serviceRef,
            agentRef,
          })
        );
        console.log('serviceRefs', serviceRefs);

        const matchedServices = allServices.filter((service) =>
          serviceRefs.some((s) => s.serviceRef === service._id)
        );
        console.log('matchedServices', matchedServices);

        setSelectedServices(matchedServices);
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

  if (!showModal || !formData) return null;

  console.log('selec', selectedServices);

  return (
    <div
      className={`fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50`}
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md ${
            smallScreen ? 'mobile-modal' : 'h-[600px] overflow-auto'
          }`}
        >
          <div className='flex justify-between items-center'>
            <div className='text-lg font-bold'>
              {type === 'client' ? 'Client Details' : 'Employee Details'}
            </div>
            <div className='cursor-pointer text-lg' onClick={closeModal}>
              x
            </div>
          </div>
          <form className='space-y-6 text-sm mt-4'>
            <div className='max-w-lg mx-auto p-4 bg-cyan-50 shadow-md rounded'>
              <h2 className='font-bold text-center'>Selected Services</h2>
              <hr className=' mb-2' />
              <div className='flex justify-evenly text-center flex-wrap'>
                {selectedServices.length > 0 ? (
                  selectedServices.map((service) => (
                    <div key={service._id} className='p-2'>
                      <label className='block font-semibold mb-1'>
                        {service.heading} - {service.subheading}
                      </label>
                      <p className='text-gray-500 italic'>
                        {service.description}
                      </p>
                      {type === 'client' && service.agentRef && (
                        <p className='text-gray-600'>
                          Agent: {getAgentName(service.agentRef)}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No services selected.</p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Username', name: 'username', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone Number', name: 'phone', type: 'text' },
                { label: 'Alternate Phone', name: 'altPhone', type: 'text' },
                { label: 'Address', name: 'address', type: 'text' },
                { label: 'Date of Birth', name: 'dob', type: 'date' },
                {
                  label: 'Adhaar Number',
                  name: 'adhaarNumber',
                  type: 'text',
                },
                { label: 'PAN Number', name: 'panNumber', type: 'text' },
                { label: 'Bank Name', name: 'bankName', type: 'text' },
                {
                  label: 'Account Number',
                  name: 'accountNumber',
                  type: 'text',
                },
                { label: 'Account Name', name: 'accountName', type: 'text' },
                { label: 'Branch Name', name: 'bankBranch', type: 'text' },
                { label: 'IFSC Code', name: 'bankCode', type: 'text' },
                ...(type === 'client'
                  ? [
                      {
                        label: 'GST Number',
                        name: 'gstNumber',
                        type: 'text',
                      },
                      {
                        label: 'Income Tax ID',
                        name: 'incomeTaxID',
                        type: 'text',
                      },
                      {
                        label: 'Income Tax Password',
                        name: 'incomeTaxPassword',
                        type: 'password',
                      },
                      {
                        label: 'TAN Number',
                        name: 'tanNumber',
                        type: 'text',
                      },
                      {
                        label: 'PTEC Number',
                        name: 'ptecNumber',
                        type: 'text',
                      },
                      { label: 'PTEC ID', name: 'ptecID', type: 'text' },
                      {
                        label: 'PTEC Password',
                        name: 'ptecPassword',
                        type: 'password',
                      },
                      {
                        label: 'Accountant Name',
                        name: 'accountantName',
                        type: 'text',
                      },
                      {
                        label: 'Accountant Phone',
                        name: 'accountantPhone',
                        type: 'text',
                      },
                    ]
                  : []),
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className='block text-zinc-700 dark:text-zinc-300'>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    disabled
                    placeholder={label}
                    className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  />
                </div>
              ))}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Adhaar Image
                </label>
                <img
                  alt='Adhaar Card'
                  src={formData.adhaarImage}
                  className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  PAN Image
                </label>
                <img
                  alt='Pan Card'
                  src={formData.panImage}
                  className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
              </div>
            </div>
            <div className='flex justify-center mt-6'>
              <button
                className='bg-blue-400 text-black px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewDetailsModal;
