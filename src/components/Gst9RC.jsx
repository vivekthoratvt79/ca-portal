import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TableComponentService from './TableComponentService';

const Gst9RC = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const openTab = (event, tabName) => {
    console.log('tabName', tabName);
    setActiveTab(tabName);
  };

  let tabKeys = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5'];
  let tabValues = ['Data', 'Working', 'Payment', 'Submit', 'Completed'];

  const handleDropdownChange = (event) => {
    const selectedTab = event.target.value;
    openTab(event, selectedTab);
  };

  let dataTableHeader = [
    'Sr No.',
    'Client Name',
    'Data Provider Name',
    'Number',
    'Upload',
  ];
  let dataTableRow = [
    [30, 'John', 'New York', '6776', 'upload'],
    [25, 'Alice', 'Los Angeles', '33', 'upload'],
    [35, 'Bob', 'Chicago', '444', 'upload'],
  ];

  return (
    <>
      <Sidebar activeTab='9rc' />
      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>GST - 9RC</div>
        </div>

        <div className='p-4 flex flex-col gap-y-5'>
          <div className='md:hidden'>
            <select
              className='w-full py-4 px-6 block leading-normal border border-gray-200 rounded-lg bg-slate-50 text-gray-900 focus:outline-none focus:shadow-outline'
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
                      ? 'border-b-0 font-medium bg-slate-50'
                      : 'border-b border-gray-200'
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
              headers={dataTableHeader}
              data={dataTableRow}
            />
          </div>

          <div
            id='tab2'
            className={`tabcontent ${
              activeTab === 'tab2' ? 'block' : 'hidden'
            }`}
          >
            Tab 2 Content Your table content goes here
          </div>

          <div
            id='tab3'
            className={`tabcontent ${
              activeTab === 'tab3' ? 'block' : 'hidden'
            }`}
          >
            Tab 3 Content Your table content goes here
          </div>

          <div
            id='tab4'
            className={`tabcontent ${
              activeTab === 'tab4' ? 'block' : 'hidden'
            }`}
          >
            Tab 4 Content Your table content goes here
          </div>
          <div
            id='tab5'
            className={`tabcontent ${
              activeTab === 'tab5' ? 'block' : 'hidden'
            }`}
          >
            Tab 5 Content Your table content goes here
          </div>
        </div>
      </div>
    </>
  );
};

export default Gst9RC;
