import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import TableComponentBill from './TableComponentBill';
import * as api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Income = ({ access }) => {
  const userRole = useSelector((state) => state.auth.authData.role);
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const [bills, setBills] = useState([]);
  const [activeTab, setActiveTab] = useState('tab1');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  let tabKeys = ['tab1', 'tab2', 'tab3'];
  let tabValues = ['Bills', 'Pending', 'Completed'];

  const handleDropdownChange = (event) => {
    const selectedTab = event.target.value;
    openTab(event, selectedTab);
  };

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

  useEffect(() => {
    function fetchBills() {
      try {
        let payload = {};
        api.getAllBillsOfAdmin(payload).then((data) => console.log(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [entitiyId, userRole]);
  return (
    <>
      <Sidebar activeTab='income' access={access} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>Income</div>
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
                    className={`w-1/3 md:w-1/3 py-4 px-6 block leading-normal border-l border-t border-r rounded-t-lg focus:outline-none focus:shadow-outline ${
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
              <TableComponentBill
                headers={[
                  'Sr No.',
                  'Name',
                  'Bill Amount',
                  'Discount',
                  'View Invoice',
                  'Status'
                ]}
                data={bills}
              />
            </div>

            <div
              id='tab2'
              className={`tabcontent ${
                activeTab === 'tab2' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentBill
                headers={[
                  'Sr No.',
                  'Name',
                  'Bill Amount',
                  'Discount',
                  'Status',
                ]}
                data={bills}
              />
            </div>

            <div
              id='tab3'
              className={`tabcontent ${
                activeTab === 'tab3' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentBill
                headers={[
                  'Sr No.',
                  'Name',
                  'Bill Amount',
                  'Discount',
                  'Status',
                ]}
                data={bills}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Income;
