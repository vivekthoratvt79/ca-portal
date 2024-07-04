import React, { useState } from 'react';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const AddClientModal = ({ showModal, closeModal, services }) => {
  const user = useSelector((state) => state.auth.authData);
  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;
  const modalDisplay = showModal ? 'block' : 'none hidden';

  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'client',
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
    gstNumber: '',
    incomeTaxID: '',
    incomeTaxPassword: '',
    tanNumber: '',
    ptecNumber: '',
    ptecID: '',
    ptecPassword: '',
    accountantName: '',
    accountantPhone: '',
    adminRef: user.entityID,
    serviceFreqMap: [],
    billType: '',
    billAmount: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.altPhone.trim())
      newErrors.altPhone = 'Alternate phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
    if (!formData.adhaarNumber.trim())
      newErrors.adhaarNumber = 'Adhaar number is required';
    if (!formData.panNumber.trim())
      newErrors.panNumber = 'Pan number is required';
    if (!formData.adhaarImage)
      newErrors.adhaarImage = 'Adhaar image is required';
    if (!formData.panImage) newErrors.panImage = 'PAN image is required';
    if (!formData.gstNumber.trim())
      newErrors.gstNumber = 'GST number is required';
    if (!formData.incomeTaxID.trim())
      newErrors.incomeTaxID = 'Income Tax ID is required';
    if (!formData.incomeTaxPassword.trim())
      newErrors.incomeTaxPassword = 'Income Tax Password is required';
    if (!formData.tanNumber.trim())
      newErrors.tanNumber = 'TAN number is required';
    if (!formData.ptecNumber.trim())
      newErrors.ptecNumber = 'PTEC number is required';
    if (!formData.ptecID.trim()) newErrors.ptecID = 'PTEC ID is required';
    if (!formData.ptecPassword.trim())
      newErrors.ptecPassword = 'PTEC Password is required';
    if (!formData.accountantName.trim())
      newErrors.accountantName = 'Accountant Name is required';
    if (!formData.accountantPhone.trim())
      newErrors.accountantPhone = 'Accountant Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (event, service) => {
    const { checked } = event.target;
    setSelectedServices((prevSelectedServices) =>
      checked
        ? [
            ...prevSelectedServices,
            {
              serviceRef: service._id,
              serviceType: '',
              billType: '',
              billAmount: '',
            },
          ]
        : prevSelectedServices.filter(
            (selectedService) => selectedService.serviceRef !== service._id
          )
    );
  };

  const handleTypeChange = (event, serviceId) => {
    const { value } = event.target;
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.map((selectedService) =>
        selectedService.serviceRef === serviceId
          ? { ...selectedService, serviceType: value }
          : selectedService
      )
    );
  };

  const handleBillTypeChange = (event, serviceId) => {
    const { value } = event.target;
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.map((selectedService) =>
        selectedService.serviceRef === serviceId
          ? { ...selectedService, billType: value }
          : selectedService
      )
    );
  };

  const handleBillAmountChange = (event, serviceId) => {
    const { value } = event.target;
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.map((selectedService) =>
        selectedService.serviceRef === serviceId
          ? { ...selectedService, billAmount: value }
          : selectedService
      )
    );
  };

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
    if (!validate()) {
      return;
    }

    formData.serviceFreqMap = selectedServices;
    console.log(formData);
    setLoading(true);
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
      setLoading(false);
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
          <div className='text-lg'>Client Registration</div>
          <div className='cursor-pointer text-lg' onClick={closeModal}>
            x
          </div>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6 text-sm mt-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              { name: 'name', type: 'text', label: 'Name' },
              { name: 'username', type: 'text', label: 'Username' },
              { name: 'password', type: 'password', label: 'Password' },
              { name: 'email', type: 'email', label: 'Email' },
              { name: 'phone', type: 'text', label: 'Phone Number' },
              { name: 'altPhone', type: 'text', label: 'Alternate Phone' },
              { name: 'address', type: 'text', label: 'Address' },
              { name: 'dob', type: 'date', label: 'Date of Birth' },
              { name: 'adhaarNumber', type: 'text', label: 'Adhaar Number' },
              { name: 'panNumber', type: 'text', label: 'Pan Number' },
              { name: 'gstNumber', type: 'text', label: 'GST Number' },
              { name: 'incomeTaxID', type: 'text', label: 'Income Tax ID' },
              {
                name: 'incomeTaxPassword',
                type: 'text',
                label: 'Income Tax Password',
              },
              { name: 'tanNumber', type: 'text', label: 'Tan Number' },
              { name: 'ptecNumber', type: 'text', label: 'PTEC Number' },
              { name: 'ptecID', type: 'text', label: 'PTEC ID' },
              { name: 'ptecPassword', type: 'text', label: 'PTEC Password' },
              {
                name: 'accountantName',
                type: 'text',
                label: 'Accountant Name',
              },
              {
                name: 'accountantPhone',
                type: 'text',
                label: 'Accountant Phone',
              },
              { name: 'adhaarImage', type: 'file', label: 'Adhaar Image' },
              { name: 'panImage', type: 'file', label: 'PAN Image' },
            ].map(({ name, type, label }) => (
              <div key={name}>
                <label className='block text-zinc-700 dark:text-zinc-300'>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={type === 'file' ? undefined : formData[name]}
                  onChange={type === 'file' ? handleFileChange : handleChange}
                  placeholder={label}
                  className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                    errors[name] ? 'border-red-500' : ''
                  }`}
                />
                {errors[name] && (
                  <div className='text-red-500'>{errors[name]}</div>
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className='text-lg mt-6'>Select Services</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {services.map((service) => (
                <div key={service._id} className='flex flex-col space-y-2'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id={service._id}
                      onChange={(e) => handleCheckboxChange(e, service)}
                      className='mr-2'
                    />
                    <label
                      htmlFor={service._id}
                      className='text-zinc-700 dark:text-zinc-300 font-bold'
                    >
                      {service.heading + ' - ' + service.subheading}
                    </label>
                  </div>
                  {selectedServices.some(
                    (selectedService) =>
                      selectedService.serviceRef === service._id
                  ) && (
                    <>
                      <div className='mx-5'>
                        <label
                          htmlFor={`serviceType-${service._id}`}
                          className='block text-zinc-700 dark:text-zinc-300'
                        >
                          Service Type
                        </label>
                        <select
                          id={`serviceType-${service._id}`}
                          required
                          value={
                            selectedServices.find(
                              (selectedService) =>
                                selectedService.serviceRef === service._id
                            )?.serviceType || ''
                          }
                          onChange={(e) => handleTypeChange(e, service._id)}
                          className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                        >
                          <option value=''>Select Type</option>
                          <option value='monthly'>Monthly</option>
                          <option value='quarterly'>Quarterly</option>
                          <option value='yearly'>Yearly</option>
                        </select>
                      </div>
                      <div className='mx-5'>
                        <label
                          htmlFor={`billType-${service._id}`}
                          className='block text-zinc-700 dark:text-zinc-300'
                        >
                          Bill Type
                        </label>
                        <select
                          id={`billType-${service._id}`}
                          required
                          value={
                            selectedServices.find(
                              (selectedService) =>
                                selectedService.serviceRef === service._id
                            )?.billType || ''
                          }
                          onChange={(e) => handleBillTypeChange(e, service._id)}
                          className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                        >
                          <option value=''>Select Type</option>
                          <option value='monthly'>Monthly</option>
                          <option value='quarterly'>Quarterly</option>
                          <option value='yearly'>Yearly</option>
                        </select>
                      </div>
                      <div className='mx-5'>
                        <label
                          htmlFor={`billAmount-${service._id}`}
                          className='block text-zinc-700 dark:text-zinc-300'
                        >
                          Bill Amount (in Rs)
                        </label>
                        <input
                          type='number'
                          id={`billAmount-${service._id}`}
                          value={
                            selectedServices.find(
                              (selectedService) =>
                                selectedService.serviceRef === service._id
                            )?.billAmount || ''
                          }
                          onChange={(e) =>
                            handleBillAmountChange(e, service._id)
                          }
                          className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
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
                    type='submit'
                    className='bg-green-400 text-black py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                  >
                    Submit
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
              Client registered successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
