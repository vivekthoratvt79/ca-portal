import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TableComponentService from './TableComponentService';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const Gst3B = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [dataUpload, setDataUpload] = useState([]);
  const [workingStage, setWorkingStage] = useState([]);
  const [submitStage, setSubmitStage] = useState([]);
  const [completeStage, setCompleteStage] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState([]);
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);

  const openTab = (event, tabName) => {
    console.log('tabName', tabName);
    setActiveTab(tabName);
  };

  let tabKeys = ['tab1', 'tab2', 'tab3', 'tab4'];
  let tabValues = ['Data', 'Working', 'Submit', 'Completed'];

  const handleDropdownChange = (event) => {
    const selectedTab = event.target.value;
    openTab(event, selectedTab);
  };

  let dataHeader = [
    'Sr No.',
    'Client Name',
    'Data Provider Name',
    'Number',
    'Client Upload',
  ];

  let workingHeader = [
    'Sr No.',
    'View',
    'Client Name',
    'Past Note',
    'Admin Upload',
    'Note',
    'Done',
  ];

  let submitHeader = ['Sr No.', 'View', 'Client Name', 'ARN Number', 'Done'];
  let completeHeader = ['Sr No.', 'View', 'Client Name', 'ARN Number'];

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
      let serviceRef = services.find(({ subheading }) => subheading == '3B');
      try {
        if (userRole == 'admin' && serviceRef) {
          api
            .getDataUploadStageDetails('', serviceRef?._id, entitiyId, 'gst3b')
            .then(({ data }) => {
              setLoading(false);
              setDataUpload(data.data.orders);
            });
          api
            .getWorkingStageDetails('', serviceRef?._id, entitiyId, 'gst3b')
            .then(({ data }) => {
              setLoading(false);
              setWorkingStage(data.data.orders);
            });

          api
            .getSubmitStageDetails('', serviceRef?._id, entitiyId, 'gst3b')
            .then(({ data }) => {
              setLoading(false);
              setSubmitStage(data.data.orders);
            });
          api
            .getCompleteStageDetails('', serviceRef?._id, entitiyId, 'gst3b')
            .then(({ data }) => {
              setLoading(false);
              setCompleteStage(data.data.orders);
            });
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
      <Sidebar activeTab='3b' />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>GST - 3B</div>
        </div>
        {loading ? (
          <Loader />
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
                    className={`w-1/2 md:w-1/4 py-4 px-6 block leading-normal border-l border-t border-r rounded-t-lg focus:outline-none focus:shadow-outline ${
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
                headers={dataHeader}
                data={dataUpload}
                service='gst3b'
                stage='data'
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
                headers={workingHeader}
                data={workingStage}
                stage='working'
                service='gst3b'
                setServices={setServices}
                services={services}
              />
            </div>

            <div
              id='tab3'
              className={`tabcontent ${
                activeTab === 'tab3' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentService
                headers={submitHeader}
                data={submitStage}
                service='gst3b'
                stage='submit'
                setServices={setServices}
                services={services}
              />
            </div>

            <div
              id='tab4'
              className={`tabcontent ${
                activeTab === 'tab4' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentService
                headers={completeHeader}
                data={completeStage}
                service='gst3b'
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

export default Gst3B;
