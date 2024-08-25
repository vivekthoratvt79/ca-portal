import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api';
import Loader from './Loader';
import { fetchClientsForAgent } from '../actions/clients';
import { fetchForAdmin } from '../actions/managers';

const ClientDetails = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [access, setAccess] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

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
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);

  const [formData, setFormData] = useState({});
  let { id } = useParams();

  // Function to get agent name from Redux store based on agent ID
  const getAgentName = (agentId) => {
    const agent = employees.find((emp) => emp._id === agentId);
    return agent ? agent.name : 'Unknown';
  };

  useEffect(() => {
    setFormData(clients.find(({ _id }) => _id === id) || {});
  }, [clients, id]);

  useEffect(() => {
    let aclient = clients.find(({ _id }) => _id === id) || {};
    console.log('aclient', aclient);
  }, [clients, id]);

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
        data.statusCode == 200 && setAllServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log('id', id);
  console.log('formData', formData);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let { data } = await api.getAgentServiceMapforClient(id);

        const serviceRefs = data?.data?.mapArr.map(
          ({ serviceRef, agentRef }) => ({
            serviceRef,
            agentRef,
          })
        );

        const matchedServices = allServices.filter((service) =>
          serviceRefs.some((s) => s.serviceRef === service._id)
        );

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
  }, [id, allServices]);

  useEffect(() => {
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

  //   const saveAccess = (e) => {
  //     e.preventDefault();
  //     let payload = {};
  //     payload.entityID = id;
  //     payload.accessKeys = access;
  //     try {
  //       api.updateAccessKeys(payload).then(({ data }) => {
  //         console.log(data);
  //         setAccessUpdated('Access Updated!');
  //       });
  //       setTimeout(() => {
  //         setAccessUpdated('');
  //       }, 4000);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    formData.clientRef = id;
    console.log(formData);
    setLoadingSave(true);
    try {
      await api.editClientDetails(formData).then((data) => {
        setLoadingSave(false);
        setIsSubmitted(true);
      });
    } catch (error) {
      setLoadingSave(false);
      setError('Failed! Please try again later.');
      setIsSubmitted(false);
    }

    setTimeout(() => {
      setLoadingSave(false);
      setIsSubmitted(false);
      setError('');
    }, 5000);
  };

  return (
    <div className='p-4 h-91vh'>
      <div
        className='flex gap-2 items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg clients-container'
        style={{ borderColor: '#41506b' }}
      >
        <div className='cursor-pointer' onClick={() => navigate('/clients')}>
          <svg
            className='w-6 h-6 text-gray-800'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 12h14M5 12l4-4m-4 4 4 4'
            />
          </svg>
        </div>
        <div>Client Details</div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className='p-4'>
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
                      {service.agentRef && (
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
                {
                  label: 'Username',
                  name: 'username',
                  type: 'text',
                  disabled: true,
                },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone Number', name: 'phone', type: 'text' },

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
                {
                  name: 'udyamAdhaarNumber',
                  type: 'text',
                  label: 'Udyam Adhaar Number',
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
                {
                  name: 'otherDetails',
                  type: 'text',
                  label: 'Other Information',
                },
              ].map(({ label, name, type, disabled }) => (
                <div key={name}>
                  <label className='block text-zinc-700'>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={type === 'file' ? handleFileChange : handleChange}
                    placeholder={label}
                    disabled={disabled ? true : false}
                    className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[name] ? 'border-red-500' : ''
                    }`}
                  />
                  {errors[name] && (
                    <div className='text-red-500'>{errors[name]}</div>
                  )}
                </div>
              ))}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label className='block text-zinc-700'>Address Proof</label>
                <input
                  type='file'
                  name='addressProof'
                  onChange={handleFileChange}
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <img
                  alt='Address Proof'
                  src={formData.addressProof}
                  className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-zinc-700'>Adhaar Image</label>
                <input
                  type='file'
                  name='adhaarImage'
                  onChange={handleFileChange}
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <img
                  alt='Adhaar Card'
                  src={formData.adhaarImage}
                  className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-zinc-700'>PAN Image</label>
                <input
                  type='file'
                  name='panImage'
                  onChange={handleFileChange}
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <img
                  alt='Pan Card'
                  src={formData.panImage}
                  className='w-full h-52 object-contain mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex justify-center text-center'>
              {loadingSave ? (
                <Loader />
              ) : (
                !isSubmitted &&
                !error && (
                  <button
                    onClick={(e) => saveChanges(e)}
                    className={`bg-green-400 text-black px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    Save Changes
                  </button>
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
                Successfully Edited!
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
