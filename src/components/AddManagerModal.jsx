import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addManager } from '../actions/managers';
import Loader from './Loader';

const AddManagerModal = ({ showModal, closeModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;
  const modalDisplay = showModal ? 'block' : 'none hidden';
  let user = useSelector((state) => state.auth.authData);
  const userRole = useSelector((state) => state.auth.authData.role);

  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [failMsg, setFailMsg] = useState('');
  const initailState = {
    username: '',
    password: '',
    role: 'manager',
    name: '',
    email: '',
    phone: '',
    adminRef: userRole == 'admin' ? user.entityID : user.entity.adminRef,
  };
  const [formData, setFormData] = useState(initailState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(addManager(formData, navigate)).then((d) => {
      setLoading(false);
      if (d.status == 'success') {
        setSuccessMsg('Manager Added Successfully');
      } else {
        setFailMsg('Error while adding manager. Try again in some time!');
      }
      setTimeout(() => {
        setSuccessMsg('');
        setFailMsg('');
        setFormData(initailState);
        closeModal();
      }, 3000);
    });
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
          <div className='text-lg'>Manager Registration</div>
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

export default AddManagerModal;
