import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Loader from './Loader';

const ViewDetailsModal = ({
  showModal,
  closeModal,
  type,
  id,
  allServices,
  setRefresh,
}) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessUpdated, setAccessUpdated] = useState('');
  const [access, setAccess] = useState([]);

  const [loadingSave, setLoadingSave] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const allAccess =
    type == 'agent' || type == 'manager'
      ? ['clients', 'agents', 'dashboard', 'settings', 'billings', 'managers']
      : [];

  const handleCheckboxChange = (service) => {
    setAccess((prev) => {
      if (prev.includes(service)) {
        return prev.filter((item) => item !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;
  const user = useSelector((state) => state.auth.authData);
  const employees = useSelector((state) => state.employees);
  const clients = useSelector((state) => state.clients);
  const managers = useSelector((state) => state.managers);

  const [formData, setFormData] = useState({});

  // Function to get agent name from Redux store based on agent ID
  const getAgentName = (agentId) => {
    const agent = employees.find((emp) => emp._id === agentId);
    return agent ? agent.name : 'Unknown';
  };

  useEffect(() => {
    setFormData(
      type === 'client'
        ? clients.find(({ _id }) => _id === id)
        : type === 'manager'
        ? managers.find(({ _id }) => _id === id)
        : employees.find(({ _id }) => _id === id)
    );
  }, [type, id]);

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

  useEffect(() => {
    // let user =
    //   type === 'client'
    //     ? clients.find(({ _id }) => _id === id)
    //     : employees.find(({ _id }) => _id === id);
    function fetchAccess() {
      try {
        api.getAccessKeys(id).then(({ data }) => {
          setAccess(data.data.user[0].accessKeys);
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (id) fetchAccess();
  }, [id]);

  if (!showModal || !formData) return null;

  console.log('access', access);

  const saveAccess = (e) => {
    e.preventDefault();
    let payload = {};
    payload.entityID = id;
    payload.accessKeys = access;
    try {
      api.updateAccessKeys(payload).then(({ data }) => {
        console.log(data);
        setAccessUpdated('Access Updated!');
      });
      setTimeout(() => {
        setAccessUpdated('');
      }, 4000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      convertToBase64(name, files[0]);
    }
  };

  const convertToBase64 = (key, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData({
        ...formData,
        [key]: reader.result,
      });
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    console.log(formData);
    console.log(type);

    try {
      if (type == 'agent') {
        formData.agentRef = id;
        await api.editAgentDetails(formData).then((data) => {
          setLoadingSave(false);
          setIsSubmitted(true);
        });
      } else if (type == 'manager') {
        formData.managerRef = id;
        await api.editManagerDetails(formData).then((data) => {
          setLoadingSave(false);
          setIsSubmitted(true);
        });
      }
    } catch (error) {
      setLoadingSave(false);
      setError('Failed! Please try again later.');
      setIsSubmitted(false);
    }
    setTimeout(() => {
      setIsSubmitted(false);
      setError('');
    }, 5000);
  };

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
              {type === 'client'
                ? 'Client Details'
                : type === 'manager'
                ? 'Manager Details'
                : 'Employee Details'}
            </div>
            <div className='cursor-pointer text-lg' onClick={closeModal}>
              x
            </div>
          </div>

          <form
            className='space-y-6 text-sm mt-4'
            onSubmit={(e) => saveChanges(e)}
          >
            {type !== 'manager' && (
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
            )}
            {(type == 'agent' || type == 'manager') && (
              <div className='max-w-lg mx-auto p-4 bg-cyan-50 shadow-md rounded'>
                <h2 className='font-bold text-center'>Manage Access</h2>
                <hr className=' mb-2' />
                <div className='flex justify-evenly text-center flex-wrap'>
                  {access.length > 0 ? (
                    <>
                      {allAccess.map((service) => (
                        <div key={service} className='p-2'>
                          <label className='block font-semibold mb-1'>
                            {service.charAt(0).toUpperCase() + service.slice(1)}
                            <input
                              type='checkbox'
                              checked={access.includes(service)}
                              onChange={() => handleCheckboxChange(service)}
                              className='ml-2'
                            />
                          </label>
                        </div>
                      ))}
                      <div className='flex justify-center'>
                        {accessUpdated ? (
                          <button className='bg-green-400 text-xs text-black px-3 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'>
                            {accessUpdated}
                          </button>
                        ) : (
                          <button
                            className='bg-teal-300 text-xs text-black px-3 py-2 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                            onClick={(e) => saveAccess(e)}
                          >
                            Update Access
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Please try again later!</p>
                  )}
                </div>
              </div>
            )}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[
                { label: 'Name', name: 'name', type: 'text' },
                {
                  label: 'Username',
                  name: 'username',
                  type: 'text',
                  disabled: true,
                },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone Number', name: 'phone', type: 'text' },
                ...(type === 'client'
                  ? [
                      {
                        label: 'Alternate Phone',
                        name: 'altPhone',
                        type: 'text',
                      },
                      { label: 'Address', name: 'address', type: 'text' },
                      {
                        label: 'Date of Incorporation',
                        name: 'dob',
                        type: 'date',
                      },
                      {
                        label: 'Adhaar Number',
                        name: 'adhaarNumber',
                        type: 'text',
                      },
                      { label: 'PAN Number', name: 'panNumber', type: 'text' },
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
                        type: 'text',
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
                        type: 'text',
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
                ...(type === 'agent'
                  ? [
                      {
                        label: 'Alternate Phone',
                        name: 'altPhone',
                        type: 'text',
                      },
                      { label: 'Address', name: 'address', type: 'text' },
                      {
                        label: 'Date of Birth',
                        name: 'dob',
                        type: 'date',
                      },
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
                      {
                        label: 'Account Name',
                        name: 'accountName',
                        type: 'text',
                      },
                      {
                        label: 'Branch Name',
                        name: 'bankBranch',
                        type: 'text',
                      },
                      { label: 'IFSC Code', name: 'bankCode', type: 'text' },
                    ]
                  : []),
              ].map(({ label, name, type, disabled }) => (
                <div key={name}>
                  <label className='block text-zinc-700 dark:text-zinc-300'>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={type === 'file' ? handleFileChange : handleChange}
                    placeholder={label}
                    disabled={disabled ? true : false}
                    required
                    className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  />
                </div>
              ))}
            </div>
            {type != 'manager' && (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-zinc-700 dark:text-zinc-300'>
                    Adhaar Image
                  </label>
                  <input
                    type='file'
                    name='adhaarImage'
                    onChange={handleFileChange}
                    className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  />
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
                  <input
                    type='file'
                    name='panImage'
                    onChange={handleFileChange}
                    className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  />
                  <img
                    alt='Pan Card'
                    src={formData.panImage}
                    className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  />
                </div>
              </div>
            )}

            <div className='flex justify-center gap-4 text-center mt-6'>
              {loadingSave ? (
                <Loader />
              ) : (
                !isSubmitted &&
                !error && (
                  <>
                    <button
                      className='bg-blue-400 text-black px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                      }}
                    >
                      Close
                    </button>

                    <button
                      type='submit'
                      className={`bg-green-400 text-black px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700`}
                    >
                      Save Changes
                    </button>
                  </>
                )
              )}
            </div>

            {error && (
              <div className='text-red-500 mt-2 flex justify-center text-center'>
                {error}
              </div>
            )}
            {isSubmitted && !error && (
              <div className='text-green-500 mt-2 flex justify-center text-center'>
                Edited successfully!
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewDetailsModal;
