import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import * as api from '../api';
import Loader from './Loader';
import { useSelector } from 'react-redux';

const Settings = ({ access }) => {
  const [adminServices, setAdminServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = useSelector((state) => state.auth.authData.role);
  const entityId = useSelector((state) => state.auth.authData.entityID);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.fetchAllServices();
        if (data.statusCode === 200) {
          setServices(data.data.services);
        }

        if (userRole === 'admin') {
          const res = await api.fetchAdminServices(entityId);
          if (res.data.statusCode === 200) {
            setAdminServices(res.data.data.adminServiceData);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [entityId, userRole]);

  return (
    <>
      <Sidebar activeTab='settings' access={access} />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Settings</div>
        </div>
        <div className='mt-4'>
          {services.length > 0 && (
            <NotificationSettings
              loading={loading}
              services={services}
              adminServices={adminServices}
            />
          )}
        </div>
      </div>
    </>
  );
};

const NotificationSettings = ({ services, adminServices, loading }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [success, setSuccess] = useState({});

  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;

  useEffect(() => {
    if (!loading && adminServices.length > 0) {
      const initialDates = {};
      adminServices.forEach((service) => {
        initialDates[service._id] = {
          monthly: Array.isArray(service.periodDetails.monthly)
            ? service.periodDetails.monthly
            : [],
          quarterly: Array.isArray(service.periodDetails.quarterly)
            ? service.periodDetails.quarterly
            : [],
          annually: Array.isArray(service.periodDetails.annually)
            ? service.periodDetails.annually
            : [],
        };
      });
      setSelectedDates(initialDates);
    }
  }, [loading, adminServices, services]);

  const handleDateChange = (serviceId, periodType, index, dateType, value) => {
    setSelectedDates((prevDates) => {
      const newDates = {
        ...prevDates,
        [serviceId]: {
          ...prevDates[serviceId],
          [periodType]: prevDates[serviceId][periodType].map((period, idx) =>
            idx === index ? { ...period, [dateType]: value } : period
          ),
        },
      };
      validateDates(serviceId, periodType, newDates);
      return newDates;
    });
  };

  const validateDates = (serviceId, periodType, dates) => {
    const { startDate, endDate } = dates[serviceId][periodType][0]; // Assuming only one period can be added at a time
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let isValid = true;
    let message = '';

    if (periodType === 'monthly') {
      // Validate monthly period
      if (diffDays > 31) {
        isValid = false;
        message = 'End date must be within 1 month from start date';
      }
    } else if (periodType === 'quarterly') {
      // Validate quarterly period
      if (diffDays > 92) {
        isValid = false;
        message = 'End date must be within three months from the start date';
      }
    } else if (periodType === 'annually') {
      // Validate annual period
      if (diffDays > 366) {
        isValid = false;
        message = 'End date must be within one year from the start date';
      }
    }

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [serviceId]: {
        ...prevErrors[serviceId],
        [periodType]: isValid ? '' : message,
      },
    }));
  };

  const getServiceName = (serviceRef) => {
    const service = services.find((service) => service._id === serviceRef);
    return service && service.heading != service.subheading
      ? `${service.heading} ${service.subheading}`
      : service
      ? service.subheading
      : 'Unknown Service';
  };

  const getMonthNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth() + 1; // +1 because getMonth() returns zero-based month index
  };

  const handleSave = async (serviceId) => {
    try {
      const service = adminServices.find(({ _id }) => _id === serviceId);

      const payload = {
        ...service,
        periodDetails: {
          monthly: selectedDates[serviceId]?.monthly || [],
          quarterly:
            selectedDates[serviceId]?.quarterly.map((period) => ({
              ...period,
              startMonth: getMonthNumber(period.startDate), // Ensure correct conversion
              endMonth: getMonthNumber(period.endDate), // Ensure correct conversion
            })) || [],
          annually: selectedDates[serviceId]?.annually || [],
        },
      };

      await api.updateAdminServiceData(payload).then((data) => {
        if (data?.status === 200) {
          setSuccess({
            [serviceId]: `Date updated successfully for ${getServiceName(
              service.serviceRef
            )}`,
          });
          setTimeout(() => {
            setSuccess({});
          }, 3000);
        }
      });
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    }
  };

  console.log('selectedd', selectedDates);
  return (
    <div
      className='p-4 mt-4 rounded-lg dark:border-gray-700'
      style={{ borderColor: '#41506b' }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className='font-semibold mb-2'>Notification Settings</h2>
          <hr className='mb-4' />

          <div className='flex flex-wrap'>
            {adminServices.length > 0 &&
              adminServices.map((service, index) => (
                <div
                  key={service._id}
                  className='space-y-4 mb-8 w-full md:w-1/2'
                >
                  <div
                    className={`${
                      smallScreen &&
                      index !== 0 &&
                      'mt-4 pt-2 border-t border-dashed'
                    }`}
                  >
                    <span className='font-medium'>
                      {getServiceName(service.serviceRef)}
                    </span>
                  </div>
                  {['monthly', 'quarterly', 'annually'].map((periodType) => (
                    <div key={periodType} className='space-y-2'>
                      <div className='font-medium italic text-sm'>
                        {periodType.charAt(0).toUpperCase() +
                          periodType.slice(1) +
                          ' :'}
                      </div>
                      {selectedDates[service._id] &&
                        selectedDates[service._id][periodType].map(
                          (period, idx) => (
                            <div
                              key={idx}
                              className='flex space-x-2 items-center'
                            >
                              <input
                                type='date'
                                className='border p-2 rounded'
                                value={period.startDate}
                                onChange={(e) =>
                                  handleDateChange(
                                    service._id,
                                    periodType,
                                    idx,
                                    'startDate',
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type='date'
                                className='border p-2 rounded'
                                value={period.endDate}
                                onChange={(e) =>
                                  handleDateChange(
                                    service._id,
                                    periodType,
                                    idx,
                                    'endDate',
                                    e.target.value
                                  )
                                }
                              />
                              {errorMessages[service._id] &&
                                errorMessages[service._id][periodType] && (
                                  <span className='text-red-500 text-xs'>
                                    {errorMessages[service._id][periodType]}
                                  </span>
                                )}
                            </div>
                          )
                        )}
                    </div>
                  ))}
                  <div className='w-full flex justify-center lg:justify-start mt-4'>
                    <div
                      className='p-2 px-4 bg-green-400 hover:bg-green-500 cursor-pointer rounded-md text-xs font-medium'
                      onClick={() => handleSave(service._id)}
                    >
                      {(success[service._id] != '' && success[service._id]) ||
                        'Update ' + getServiceName(service.serviceRef)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
