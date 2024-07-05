import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Loader from './Loader';

const AddAdminModal = ({ showModal, closeModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;
  const modalDisplay = showModal ? 'block' : 'none hidden';
  let user = useSelector((state) => state.auth.authData);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [failMsg, setFailMsg] = useState('');
  const [errors, setErrors] = useState({});
  const initialState = {
    username: '',
    password: '',
    role: 'admin',
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    dob: '',
    clientCount: 0,
    agentCount: 0,
    serviceString: 'GST R1, GST 3B',
    gstNumber: '',
    reverseCharge: 'true',
  };
  const [formData, setFormData] = useState(initialState);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone || !phoneRegex.test(formData.phone))
      newErrors.phone = 'Phone number must be numeric';
    if (isNaN(formData.clientCount))
      newErrors.clientCount = 'Client count must be a number';
    if (isNaN(formData.agentCount))
      newErrors.agentCount = 'Agent count must be a number';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await api.register(formData);
      setLoading(false);
      if (response.data.status === 'success') {
        setSuccessMsg('Admin Successfully Registered');
      } else {
        setFailMsg('Error while adding admin. Try again in some time!');
      }
      setTimeout(() => {
        setSuccessMsg('');
        setFailMsg('');
        setFormData(initialState);
        closeModal();
      }, 3000);
    } catch (error) {
      setLoading(false);
      setFailMsg('Error while adding manager. Try again in some time!');
    }
  };

  return (
    <div
      className={`fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 ${modalDisplay}`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md ${
          smallScreen ? 'mobile-modal' : ''
        }`}
      >
        <div className='flex justify-between items-center'>
          <div className='text-lg'>Employee Registration</div>
          <div className='cursor-pointer text-lg' onClick={closeModal}>
            x
          </div>
        </div>
        {successMsg ? (
          <div className='p-10 text-center'>
            <h3>{successMsg}</h3>
            <div className='check'></div>
          </div>
        ) : failMsg ? (
          <div className='p-10 text-center text-red-500'>{failMsg}</div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6 text-sm mt-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Name'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.name && (
                  <p className='text-red-500 text-xs'>{errors.name}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Username'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.username && (
                  <p className='text-red-500 text-xs'>{errors.username}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Password
                </label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.password && (
                  <p className='text-red-500 text-xs'>{errors.password}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.email && (
                  <p className='text-red-500 text-xs'>{errors.email}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Phone Number
                </label>
                <input
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Phone Number'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.phone && (
                  <p className='text-red-500 text-xs'>{errors.phone}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Alternate Phone Number
                </label>
                <input
                  type='text'
                  name='altPhone'
                  value={formData.altPhone}
                  onChange={handleChange}
                  placeholder='Alternate Phone Number'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Address
                </label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Address'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Date of Birth
                </label>
                <input
                  type='date'
                  name='dob'
                  value={formData.dob}
                  onChange={handleChange}
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                  required
                />
                {errors.dob && (
                  <p className='text-red-500 text-xs'>{errors.dob}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Client Count
                </label>
                <input
                  type='number'
                  name='clientCount'
                  value={formData.clientCount}
                  onChange={handleChange}
                  placeholder='Client Count'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
                {errors.clientCount && (
                  <p className='text-red-500 text-xs'>{errors.clientCount}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Agent Count
                </label>
                <input
                  type='number'
                  name='agentCount'
                  value={formData.agentCount}
                  onChange={handleChange}
                  placeholder='Agent Count'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
                {errors.agentCount && (
                  <p className='text-red-500 text-xs'>{errors.agentCount}</p>
                )}
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  GST Number
                </label>
                <input
                  type='text'
                  name='gstNumber'
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder='GST Number'
                  className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                />
              </div>
              <div>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  Reverse Charge
                </label>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    name='reverseCharge'
                    value='true'
                    checked={formData.reverseCharge === 'true'}
                    onChange={handleChange}
                    className='mr-2'
                  />
                  <label className='mr-4'>Yes</label>
                  <input
                    type='radio'
                    name='reverseCharge'
                    value='false'
                    checked={formData.reverseCharge === 'false'}
                    onChange={handleChange}
                    className='mr-2'
                  />
                  <label>No</label>
                </div>
              </div>
            </div>

            <div className='flex justify-center mt-6'>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <button
                    className='bg-neutral-200 mr-2 text-black px-4 py-2 rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-700'
                    onClick={(e) => {
                      e.preventDefault();
                      closeModal();
                    }}
                  >
                    Close
                  </button>
                  <button
                    type='submit'
                    className='bg-green-400 text-black px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700'
                  >
                    Add Manager
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAdminModal;
