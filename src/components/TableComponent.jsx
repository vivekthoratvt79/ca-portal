import React, { useState } from 'react';
import ViewDetailsModal from './ViewDetailsModal';
import AssignWork from './AssignWork';

const TableComponent = ({ headers, data, type, allServices }) => {
  // Mapping headers to the keys in the data objects
  const keyMap = {
    'Sr No.': 'index',
    Name: 'name',
    Email: 'email',
    Number: 'phone',
    Upload: 'upload',
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);

  const [id, setId] = useState('');
  const openDetailsModal = () => {
    setShowDetailsModal(true);
  };
  const closeDetailsModal = () => {
    console.log('called');
    setShowDetailsModal(false);
  };

  const openWorkModal = () => {
    setShowWorkModal(true);
  };
  const closeWorkModal = () => {
    setShowWorkModal(false);
  };
  return (
    <>
      {type != 'manager' && (
        <>
          <ViewDetailsModal
            type={type}
            id={id}
            showModal={showDetailsModal}
            closeModal={closeDetailsModal}
            allServices={allServices}
          />
          <AssignWork
            type={type}
            id={id}
            showModal={showWorkModal}
            closeModal={closeWorkModal}
            allServices={allServices}
          />
        </>
      )}
      <div className='overflow-x-auto'>
        <table className='table-auto w-full border-collapse'>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'
                >
                  {header}
                </th>
              ))}
              {type != 'manager' && (
                <th className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'>
                  Assign Work
                </th>
              )}
              {(type == 'agent' || type == 'client') && (
                <th className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'>
                  View Details
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => {
                  const cellData =
                    header === 'Sr No.'
                      ? rowIndex + 1
                      : rowData[keyMap[header]];
                  return (
                    <td
                      key={cellIndex}
                      className='px-4 py-2 border border-gray-300 text-center'
                    >
                      {cellData === 'upload' ? (
                        <input
                          type='file'
                          className='text-xs text-stone-500
                          file:mr-5 file:py-1 file:px-3 file:border-[1px]
                          file:text-xs file:font-small
                          file:bg-stone-50 file:text-stone-700
                          hover:file:cursor-pointer hover:file:bg-blue-50
                          hover:file:text-blue-700'
                          onChange={(e) => {
                            let file = e.target.files[0];
                            console.log('file', file);
                          }}
                        />
                      ) : (
                        cellData
                      )}
                    </td>
                  );
                })}
                {type != 'manager' && (
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    <button
                      className='px-3 py-1 text-white rounded'
                      onClick={() => {
                        setId(rowData._id);
                        openWorkModal();
                      }}
                      title='Assign work'
                    >
                      <svg
                        version='1.1'
                        id='Layer_1'
                        x='0px'
                        y='0px'
                        width={30}
                        viewBox='0 0 113.39 122.88'
                      >
                        <g>
                          <path d='M39.01,79.72c-1.38,0-2.49-1.33-2.49-2.97c0-1.64,1.12-2.97,2.49-2.97h13.63c1.38,0,2.49,1.33,2.49,2.97 c0,1.64-1.12,2.97-2.49,2.97H39.01L39.01,79.72z M85.66,67.41c7.66,0,14.59,3.1,19.61,8.12c5.02,5.02,8.12,11.95,8.12,19.61 s-3.1,14.59-8.12,19.61c-5.02,5.02-11.95,8.12-19.61,8.12s-14.59-3.1-19.61-8.12c-5.02-5.02-8.12-11.95-8.12-19.61 s3.1-14.59,8.12-19.61C71.07,70.51,78,67.41,85.66,67.41L85.66,67.41z M83.54,82.17c0-1.37,1.11-2.48,2.48-2.48 c1.37,0,2.48,1.11,2.48,2.48v12.92l9.66,5.72c1.18,0.69,1.57,2.21,0.87,3.39c-0.69,1.18-2.21,1.57-3.39,0.87L84.89,98.7 c-0.8-0.41-1.35-1.24-1.35-2.21V82.17L83.54,82.17z M101.77,79.04c-4.12-4.12-9.82-6.67-16.11-6.67c-6.29,0-11.99,2.55-16.11,6.67 c-4.12,4.12-6.67,9.82-6.67,16.11c0,6.29,2.55,11.99,6.67,16.11c4.12,4.12,9.82,6.67,16.11,6.67c6.29,0,11.99-2.55,16.11-6.67 c4.12-4.12,6.67-9.82,6.67-16.11S105.89,83.16,101.77,79.04L101.77,79.04z M44.1,109.94c1.64,0,2.97,1.33,2.97,2.97 c0,1.64-1.33,2.97-2.97,2.97H6.92c-1.9,0-3.63-0.78-4.89-2.03C0.78,112.6,0,110.87,0,108.97V6.92c0-1.91,0.78-3.63,2.03-4.89 C3.28,0.78,5.01,0,6.92,0h84.9c1.9,0,3.63,0.78,4.89,2.03c1.25,1.25,2.03,2.98,2.03,4.89V54.2c0,1.64-1.33,2.97-2.97,2.97 c-1.64,0-2.97-1.33-2.97-2.97V6.92c0-0.26-0.11-0.5-0.29-0.68c-0.18-0.18-0.42-0.29-0.68-0.29H6.92c-0.26,0-0.51,0.11-0.68,0.29 C6.05,6.41,5.94,6.65,5.94,6.92v102.05c0,0.26,0.11,0.51,0.29,0.68c0.18,0.18,0.42,0.29,0.68,0.29H44.1L44.1,109.94z M19.12,72.49 h7.45c0.54,0,0.98,0.44,0.98,0.98v7.45c0,0.54-0.44,0.98-0.98,0.98h-7.45c-0.54,0-0.98-0.44-0.98-0.98v-7.45 C18.15,72.92,18.59,72.49,19.12,72.49L19.12,72.49z M19.12,21.49h7.45c0.54,0,0.98,0.44,0.98,0.98v7.45c0,0.54-0.44,0.98-0.98,0.98 h-7.45c-0.54,0-0.98-0.44-0.98-0.98v-7.45C18.15,21.93,18.59,21.49,19.12,21.49L19.12,21.49z M39.01,28.72 c-1.38,0-2.49-1.33-2.49-2.97s1.12-2.97,2.49-2.97h35.46c1.38,0,2.49,1.33,2.49,2.97s-1.12,2.97-2.49,2.97H39.01L39.01,28.72z M22.17,56.14c-0.64,0.51-1.56,0.38-2.21-0.25c-0.07-0.05-0.14-0.11-0.21-0.18l-3.12-3.22c-0.65-0.68-0.5-1.81,0.34-2.53 c0.84-0.72,2.05-0.76,2.71-0.08l1.7,1.75l5.47-4.4c0.73-0.59,1.85-0.33,2.49,0.57c0.64,0.9,0.56,2.11-0.17,2.7L22.17,56.14 L22.17,56.14z M37.37,53.65c-1.38,0-2.49-1.33-2.49-2.97c0-1.64,1.12-2.97,2.49-2.97h35.46c1.38,0,2.49,1.33,2.49,2.97 c0,1.64-1.12,2.97-2.49,2.97H37.37L37.37,53.65z' />
                        </g>
                      </svg>
                    </button>
                  </td>
                )}
                {(type == 'agent' || type == 'client') && (
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    <button
                      className='px-3 py-1 text-white rounded'
                      onClick={() => {
                        setId(rowData._id);
                        openDetailsModal();
                      }}
                      title='View Details'
                    >
                      <svg
                        version='1.1'
                        id='Layer_1'
                        x='0px'
                        y='0px'
                        width={30}
                        viewBox='0 0 122.88 83.78'
                      >
                        <g>
                          <path d='M95.73,10.81c10.53,7.09,19.6,17.37,26.48,29.86l0.67,1.22l-0.67,1.21c-6.88,12.49-15.96,22.77-26.48,29.86 C85.46,79.88,73.8,83.78,61.44,83.78c-12.36,0-24.02-3.9-34.28-10.81C16.62,65.87,7.55,55.59,0.67,43.1L0,41.89l0.67-1.22 c6.88-12.49,15.95-22.77,26.48-29.86C37.42,3.9,49.08,0,61.44,0C73.8,0,85.45,3.9,95.73,10.81L95.73,10.81z M60.79,22.17l4.08,0.39 c-1.45,2.18-2.31,4.82-2.31,7.67c0,7.48,5.86,13.54,13.1,13.54c2.32,0,4.5-0.62,6.39-1.72c0.03,0.47,0.05,0.94,0.05,1.42 c0,11.77-9.54,21.31-21.31,21.31c-11.77,0-21.31-9.54-21.31-21.31C39.48,31.71,49.02,22.17,60.79,22.17L60.79,22.17L60.79,22.17z M109,41.89c-5.5-9.66-12.61-17.6-20.79-23.11c-8.05-5.42-17.15-8.48-26.77-8.48c-9.61,0-18.71,3.06-26.76,8.48 c-8.18,5.51-15.29,13.45-20.8,23.11c5.5,9.66,12.62,17.6,20.8,23.1c8.05,5.42,17.15,8.48,26.76,8.48c9.62,0,18.71-3.06,26.77-8.48 C96.39,59.49,103.5,51.55,109,41.89L109,41.89z' />
                        </g>
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableComponent;
