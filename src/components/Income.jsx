import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import TableComponentBill from './TableComponentBill';
import * as api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Income = ({ access }) => {
  let user = useSelector((state) => state.auth.authData);
  const userRole = useSelector((state) => state.auth.authData.role);
  const [bills, setBills] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [receipt, setReceipt] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState('tab1');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  let tabKeys = ['tab1', 'tab2', 'tab3'];
  let tabValues = ['Bills', 'Pending', 'Receipt'];

  let billHeaders = [
    'Sr No.',
    'Client Name',
    'Details',
    'Discount',
    'Final Amount',
    'Edit',
  ];
  let pendingBillHeaders = [
    'Sr No.',
    'Client Name',
    'Details',
    'Discount',
    'Final Amount',
    'Pending Amount',
    'Invoice',
    'Payment',
  ];
  let receiptHeaders = [
    'Sr No.',
    'Client Name',
    'Details',
    'Final Amount',
    'Received Amount',
    'Receipt',
  ];

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
        setLoading(true);
        let id = userRole == 'admin' ? user.entityID : user.entity.adminRef;
        api.getBillsInApprovalStage(id).then(({ data }) => {
          setBills(data.data);
          setLoading(false);
        });
        api.getBillsInPendingStage(id).then(({ data }) => {
          setPendingBills(data.data.bills);
          setLoading(false);
        });
        api.getBillsInReceiptStage(id).then(({ data }) => {
          setReceipt(data.data.bills);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    if (user) fetchBills();
  }, [user, userRole, refresh]);
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
                headers={billHeaders}
                data={bills}
                setRefresh={setRefresh}
                stage='bills'
              />
            </div>

            <div
              id='tab2'
              className={`tabcontent ${
                activeTab === 'tab2' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentBill
                headers={pendingBillHeaders}
                data={pendingBills}
                setRefresh={setRefresh}
                stage='pending'
              />
            </div>

            <div
              id='tab3'
              className={`tabcontent ${
                activeTab === 'tab3' ? 'block' : 'hidden'
              }`}
            >
              <TableComponentBill
                headers={receiptHeaders}
                data={receipt}
                setRefresh={setRefresh}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Income;
