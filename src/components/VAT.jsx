import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TableComponentService from './TableComponentService';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { useLocation, useNavigate } from 'react-router-dom';

const VAT = ({ access }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [docStage, setDocStage] = useState([]);
  const [completeStage, setCompleteStage] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = useSelector((state) => state.auth.authData.role);
  const user = useSelector((state) => state.auth.authData);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);

  const location = useLocation();
  const navigate = useNavigate();

  const openTab = (event, tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  let tabKeys = ['tab1', 'tab2'];
  let tabValues = ['Document', 'Completed'];

  const handleDropdownChange = (event) => {
    const selectedTab = event.target.value;
    openTab(event, selectedTab);
  };

  let docHeader = [
    'Sr No.',
    'Client Name',
    'Acknowledgement No.',
    'Acknowledgement',
    'Done',
  ];

  let completeHeader = ['Sr No.', 'View', 'Client Name', 'Acknowledgement No.'];

  useEffect(() => {
    setLoading(true);
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      let serviceRef = services.find(({ subheading }) => subheading == 'VAT');
      try {
        if ((userRole == 'admin' || userRole == 'manager') && serviceRef) {
          let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;
          api
            .getDocSendingDetails('', serviceRef?._id, id, 'vat')
            .then(({ data }) => {
              setLoading(false);
              setDocStage(data.data.orders);
            });
          api
            .getCompleteStageDetails('', serviceRef?._id, id, 'vat')
            .then(({ data }) => {
              setLoading(false);
              setCompleteStage(data.data.orders);
            });
        } else if (userRole == 'agent' && serviceRef) {
          let adminId = user.entity.adminRef;
          api
            .getDocSendingDetails(entitiyId, serviceRef?._id, adminId, 'vat')
            .then(({ data }) => {
              setLoading(false);
              setDocStage(data.data.orders);
            });
          api
            .getCompleteStageDetails(entitiyId, serviceRef?._id, adminId, 'vat')
            .then(({ data }) => {
              setLoading(false);
              setCompleteStage(data.data.orders);
            });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log('Error: ', error);
      } finally {
      }
    }
    if (services) fetchData();
  }, [services]);
  return (
    <>
      <Sidebar activeTab='vat' access={access} />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>VAT</div>
        </div>
        {loading ? (
          <Loader appendClass='h-[500px]' />
        ) : (
          <div className='p-4 flex flex-col gap-y-5'>
            <div className='md:hidden'>
              <select
                className='w-full font-semibold bg-slate-50 py-4 px-6 block leading-normal border border-gray-300 rounded-lg bg-slate-50 text-gray-900 focus:outline-none focus:shadow-outline'
                value={activeTab}
                onChange={handleDropdownChange}
              >
                {tabKeys.map((tab, index) => (
                  <option key={index} value={tab}>
                    {tabValues[index]}
                  </option>
                ))}
              </select>
            </div>
            <div className='hidden md:block border-b border-gray-200'>
              <nav className='flex flex-wrap -mb-px'>
                {tabKeys.map((tab, index) => (
                  <button
                    key={index}
                    className={`w-1/2 md:w-1/2 py-4 px-6 block leading-normal border-l border-t border-r rounded-t-lg focus:outline-none focus:shadow-outline ${
                      activeTab === tab
                        ? 'border-b-0 font-semibold bg-slate-50'
                        : 'border-b border-gray-200 bg-gray-100'
                    }`}
                    onClick={(event) => openTab(event, tab)}
                  >
                    {tabValues[index]}
                  </button>
                ))}
              </nav>
            </div>

            <div
              id='tab1'
              className={`tabcontent ${
                activeTab === 'tab1' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentService
                headers={docHeader}
                data={docStage}
                service='vat'
                stage='doc'
                setServices={setServices}
                services={services}
              />
            </div>
            <div
              id='tab2'
              className={`tabcontent ${
                activeTab === 'tab2' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentService
                headers={completeHeader}
                data={completeStage}
                service='vat'
                stage='completed'
                setServices={setServices}
                services={services}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VAT;
