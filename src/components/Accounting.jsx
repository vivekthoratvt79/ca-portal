import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TableComponentService from './TableComponentService';
import * as api from '../api';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { useLocation, useNavigate } from 'react-router-dom';

const Accounting = ({ access }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [dataUpload, setDataUpload] = useState([]);
  const [workingStage, setWorkingStage] = useState([]);
  const [submitStage, setSubmitStage] = useState([]);
  const [docStage, setDocStage] = useState([]);
  const [paymentStage, setPaymentStage] = useState([]);
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

  let tabKeys = ['tab1', 'tab2', 'tab3'];
  let tabValues = ['Data', 'Working', 'Document'];

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
      let serviceRef = services.find(
        ({ subheading }) => subheading == 'Accounting'
      );
      try {
        if ((userRole == 'admin' || userRole == 'manager') && serviceRef) {
          let id = userRole == 'admin' ? entitiyId : user.entity.adminRef;
          api
            .getDataUploadStageDetails('', serviceRef?._id, id, 'accounting')
            .then(({ data }) => {
              setLoading(false);
              setDataUpload(data.data.orders);
            });
          api
            .getWorkingStageDetails('', serviceRef?._id, id, 'accounting')
            .then(({ data }) => {
              setLoading(false);
              setWorkingStage(data.data.orders);
            });

          api
            .getDocSendingDetails('', serviceRef?._id, id, 'accounting')
            .then(({ data }) => {
              setLoading(false);
              setDocStage(data.data.orders);
            });
        } else if (userRole == 'agent') {
          let adminId = user.entity.adminRef;
          api
            .getDataUploadStageDetails(
              entitiyId,
              serviceRef?._id,
              adminId,
              'accounting'
            )
            .then(({ data }) => {
              setLoading(false);
              setDataUpload(data.data.orders);
            });
          api
            .getWorkingStageDetails(
              entitiyId,
              serviceRef?._id,
              adminId,
              'accounting'
            )
            .then(({ data }) => {
              setLoading(false);
              setWorkingStage(data.data.orders);
            });

          api
            .getDocSendingDetails(
              entitiyId,
              serviceRef?._id,
              adminId,
              'accounting'
            )
            .then(({ data }) => {
              setLoading(false);
              setDocStage(data.data.orders);
            });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log('Error: ', error);
      } finally {
      }
    }
    if (services.length) fetchData();
  }, [services]);
  return (
    <>
      <Sidebar activeTab='accounting' access={access} />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Accounting</div>
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
                    className={`w-1/2 md:w-1/3 py-4 px-6 block leading-normal border-l border-t border-r rounded-t-lg focus:outline-none focus:shadow-outline ${
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
                service='accounting'
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
                service='accounting'
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
                service='accounting'
                stage='doc'
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

export default Accounting;
