import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TableComponentService from './TableComponentService';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { useLocation, useNavigate } from 'react-router-dom';

const TDS = ({ access }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [dataUpload, setDataUpload] = useState([]);
  const [workingStage, setWorkingStage] = useState([]);
  const [docStage, setDocStage] = useState([]);
  const [paymentStage, setPaymentStage] = useState([]);
  const [submitStage, setSubmitStage] = useState([]);
  const [completeStage, setCompleteStage] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = useSelector((state) => state.auth.authData.role);
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

  let tabKeys = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5'];
  let tabValues = ['Data', 'Working', 'Document', 'Payment', 'Submit'];

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
    'Tax Amount',
    'Note',
    'Done',
  ];

  let docSendingHeader = ['Sr No.', 'Client Name', 'Doc Upload', 'Done'];
  let paymentHeader = ['Sr No.', 'View', 'Client Name', 'Payment'];

  let submitHeader = [
    'Sr No.',
    'View',
    'Client Name',
    'CIN No.',
    'CIN',
    'Done',
  ];

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
      let serviceRef = services.find(({ subheading }) => subheading == 'TDS');
      try {
        if (userRole == 'admin' && serviceRef) {
          api
            .getDataUploadStageDetails('', serviceRef?._id, entitiyId, 'tds')
            .then(({ data }) => {
              setLoading(false);
              setDataUpload(data.data.orders);
            });
          api
            .getWorkingStageDetails('', serviceRef?._id, entitiyId, 'tds')
            .then(({ data }) => {
              setLoading(false);
              setWorkingStage(data.data.orders);
            });
          api
            .getDocSendingDetails('', serviceRef?._id, entitiyId, 'tds')
            .then(({ data }) => {
              setLoading(false);
              setDocStage(data.data.orders);
            });
          api
            .getPaymentStageDetails('', serviceRef?._id, entitiyId, 'tds')
            .then(({ data }) => {
              setLoading(false);
              setPaymentStage(data.data.orders);
            });

          api
            .getSubmitStageDetails('', serviceRef?._id, entitiyId, 'tds')
            .then(({ data }) => {
              setLoading(false);
              setSubmitStage(data.data.orders);
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
      <Sidebar activeTab='tds' access={access} />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>TDS / TCS</div>
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
                    className={`w-1/2 md:w-1/5 py-4 px-6 block leading-normal border-l border-t border-r rounded-t-lg focus:outline-none focus:shadow-outline ${
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
              {dataUpload.length > 0 && (
                <p className='mb-4 text-sm'>
                  (Bank Statment, Deductions, , Investment, Shares, Interest
                  certifite)
                </p>
              )}
              <TableComponentService
                headers={dataHeader}
                data={dataUpload}
                service='tds'
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
                service='tds'
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
                headers={docSendingHeader}
                data={docStage}
                service='tds'
                stage='doc'
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
                headers={paymentHeader}
                data={paymentStage}
                service='tds'
                stage='payment'
                setServices={setServices}
                services={services}
              />
            </div>

            <div
              id='tab5'
              className={`tabcontent ${
                activeTab === 'tab5' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentService
                headers={submitHeader}
                data={submitStage}
                service='tds'
                stage='submit'
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

export default TDS;
