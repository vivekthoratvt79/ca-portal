import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const AddEmployeeModal = ({ showModal, closeModal, services }) => {
  const navigate = useNavigate();
  let user = useSelector((state) => state.auth.authData);
  const userRole = useSelector((state) => state.auth.authData.role);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;
  const modalDisplay = showModal ? 'block' : 'none hidden';
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'agent',
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    dob: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankBranch: '',
    bankCode: '',
    adhaarNumber: '',
    panNumber: '',
    adhaarImage: '',
    panImage: '',
    adminRef: userRole == 'admin' ? user.entityID : user.entity.adminRef,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prevSelectedServices) =>
      checked
        ? [...prevSelectedServices, value]
        : prevSelectedServices.filter((service) => service !== value)
    );
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
    formData.serviceRefs = selectedServices;
    console.log(formData);
    try {
      await api.register(formData).then((data) => {
        setLoading(false);
        setIsSubmitted(true);
      });
    } catch (error) {
      setLoading(false);
      setError('Registration failed. Please try again later.');
      setIsSubmitted(false);
    }
    setTimeout(() => {
      setIsSubmitted(false);
      setError('');
    }, 5000);
  };
  return (
    <div
      className={`fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 ${modalDisplay}`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md ${
          smallScreen ? 'mobile-modal' : 'h-[600px] overflow-auto'
        }`}
      >
        <div className='flex justify-between items-center'>
          <div className='text-lg'>Employee Registration</div>
          <div className='cursor-pointer text-lg' onClick={closeModal}>
            x
          </div>
        </div>
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
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Alternate Phone
              </label>
              <input
                type='text'
                name='altPhone'
                value={formData.altPhone}
                onChange={handleChange}
                placeholder='Alternate Phone'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
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
                required
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
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Adhaar Number
              </label>
              <input
                type='text'
                name='adhaarNumber'
                value={formData.adhaarNumber}
                onChange={handleChange}
                placeholder='Adhaar Number'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                PAN Number
              </label>
              <input
                type='text'
                name='panNumber'
                value={formData.panNumber}
                onChange={handleChange}
                placeholder='PAN Number'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Bank Name
              </label>
              <input
                type='text'
                name='bankName'
                value={formData.bankName}
                onChange={handleChange}
                placeholder='Bank Name'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Account Number
              </label>
              <input
                type='text'
                name='accountNumber'
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder='Account Number'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Account Name
              </label>
              <input
                type='text'
                name='accountName'
                value={formData.accountName}
                onChange={handleChange}
                placeholder='Account Name'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Branch Name
              </label>
              <input
                type='text'
                name='bankBranch'
                value={formData.bankBranch}
                onChange={handleChange}
                placeholder='Branch Name'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                IFSC Code
              </label>
              <input
                type='text'
                name='bankCode'
                value={formData.bankCode}
                onChange={handleChange}
                placeholder='IFSC Code'
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
              />
            </div>
            <div>
              <label className='block text-zinc-700 dark:text-zinc-300'>
                Adhaar Image
              </label>
              <input
                type='file'
                name='adhaarImage'
                onChange={handleFileChange}
                className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                required
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
                required
              />
            </div>
          </div>

          <div>
            <h4>Services</h4>
            <hr className='mb-2'></hr>
            {services.map((service) => (
              <div key={service._id} className='mb-2'>
                <input
                  type='checkbox'
                  id={`service-${service._id}`}
                  name='services'
                  value={service._id}
                  checked={selectedServices.includes(service._id)}
                  onChange={handleCheckboxChange}
                  className='mr-2'
                />
                <label
                  htmlFor={`service-${service._id}`}
                  className='inline-flex items-start'
                >
                  <span className='font-semibold'>{`${service.heading} (${service.subheading})`}</span>
                  <p className='ml-2 text-gray-700'>{service.description}</p>
                  <p className='ml-2 text-gray-500 italic'>
                    {service.serviceType}
                  </p>
                </label>
              </div>
            ))}
          </div>

          <div className='flex justify-center text-center'>
            {loading ? (
              <Loader />
            ) : (
              !isSubmitted &&
              !error && (
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
                    className={`bg-green-400 text-black px-4 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700`}
                  >
                    Add Employee
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
              Employee registered successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
