import React, { useState } from 'react';
import * as api from '../api'; // Ensure this is the correct path to your API module

const TableComponentService = ({
  headers,
  data,
  service,
  stage,
  setServices,
  services,
}) => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [adminSelectedFiles, setAdminSelectedFiles] = useState({});
  const [noteValues, setNoteValues] = useState({});
  const [arnValues, setArnValues] = useState({});

  // Mapping headers to the keys in the data objects
  const keyMap = {
    'Sr No.': 'index',
    'Client Name': 'clientName',
    'Data Provider Name': 'dataProviderName',
    Number: 'clientNumber',
    'Client Upload': 'clientUpload', // Assuming 'upload' is a placeholder for file input
    'Admin Upload': 'adminUpload', // Assuming 'upload' is a placeholder for file input
    View: 'clientUploadArray', // Assuming '_id' can be used uniquely for identifying rows
    'Past Note': 'pastNote',
    Working: 'currentNote',
    Note: 'currentNote',
    Done: 'currentNote',
    'ARN Number': 'arnNumber',
  };

  const handleFileChange = (rowIndex, files) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [rowIndex]: files,
    }));
  };

  const handleFileChangeforAdmin = (rowIndex, files) => {
    setAdminSelectedFiles((prev) => ({
      ...prev,
      [rowIndex]: files,
    }));
  };

  const handleUpload = async (rowIndex, rowData) => {
    const files = selectedFiles[rowIndex];
    if (!files) return;

    const formData = new FormData();
    let { adminRef, agentRef, clientRef, serviceRef, _id } = rowData;
    formData.append('adminRef', adminRef);
    formData.append('agentRef', agentRef);
    formData.append('clientRef', clientRef);
    formData.append('serviceRef', serviceRef);
    formData.append('orderRef', _id);

    // Append files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // Debugging: Log the formData content
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(
          `${pair[0]}: ${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type}`
        );
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      const response = await api.postClientDataUpload(formData, service);
      console.log('Upload response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleWorkDone = async (rowIndex, rowData) => {
    const files = adminSelectedFiles[rowIndex];
    if (!files) return;
    const formData = new FormData();
    let { adminRef, _id } = rowData;
    formData.append('adminRef', adminRef);
    formData.append('currentNote', noteValues[rowIndex]);
    formData.append('orderRef', _id);

    // Append files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response = await api.postWorkingStageDetails(formData, service);
      console.log('Work response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handleSubmitDone = async (rowIndex, rowData) => {
    const formData = {};
    let { _id } = rowData;
    formData.orderRef = _id;
    formData.arnNumber = arnValues[rowIndex];
    if (!arnValues[rowIndex]) return;
    try {
      const response = await api.postSubmitStageDetails(formData, service);
      console.log('Submit response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handleNoteChange = (rowIndex, value) => {
    setNoteValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleArnChange = (rowIndex, value) => {
    setArnValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  return (
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
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, cellIndex) => {
                const cellData =
                  header === 'Sr No.' ? rowIndex + 1 : rowData[keyMap[header]];
                return (
                  <td
                    key={cellIndex}
                    className={`${
                      header === 'Client Upload' && 'w-72'
                    } px-4 py-2 border border-gray-300 text-center`}
                  >
                    {header === 'Client Upload' ? (
                      <div className='flex items-center'>
                        <input
                          type='file'
                          multiple='multiple'
                          accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                          className='text-xs text-stone-500 file:mr-2 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-small file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700'
                          onChange={(e) =>
                            handleFileChange(rowIndex, e.target.files)
                          }
                        />
                        <button
                          onClick={() => handleUpload(rowIndex, rowData)}
                          className='ml-2 text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                          Upload
                        </button>
                      </div>
                    ) : header === 'Admin Upload' ? (
                      <div className='flex items-center w-52'>
                        <input
                          type='file'
                          multiple='multiple'
                          accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                          className='text-xs text-stone-500 file:mr-2 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-small file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700'
                          onChange={(e) =>
                            handleFileChangeforAdmin(rowIndex, e.target.files)
                          }
                        />
                      </div>
                    ) : header === 'View' ? (
                      stage === 'submit' || stage === 'completed' ? (
                        <>
                          {rowData.clientUploadArray &&
                            rowData.clientUploadArray.length > 0 &&
                            rowData.clientUploadArray.map((file, fileIndex) => {
                              const getFileNameFromURL = (url) => {
                                const parts = url.split('/');
                                return parts[parts.length - 1];
                              };
                              return (
                                <p key={fileIndex}>
                                  <a
                                    target='_blank'
                                    className='text-sm text-blue-500 underline'
                                    href={file}
                                    title={getFileNameFromURL(file)}
                                  >
                                    {getFileNameFromURL(file).length > 30
                                      ? getFileNameFromURL(file).substring(
                                          0,
                                          20
                                        ) +
                                        '...' +
                                        getFileNameFromURL(file).substring(
                                          getFileNameFromURL(file).length - 7,
                                          getFileNameFromURL(file).length
                                        )
                                      : getFileNameFromURL(file)}
                                  </a>
                                </p>
                              );
                            })}
                          {rowData.agentUploadArray &&
                            rowData.agentUploadArray.length > 0 &&
                            rowData.agentUploadArray.map((file, fileIndex) => {
                              const getFileNameFromURL = (url) => {
                                const parts = url.split('/');
                                return parts[parts.length - 1];
                              };
                              return (
                                <p
                                  key={fileIndex}
                                  className='whitespace-nowrap'
                                >
                                  <a
                                    target='_blank'
                                    className='text-sm text-blue-500 underline'
                                    href={file}
                                    title={getFileNameFromURL(file)}
                                  >
                                    {getFileNameFromURL(file).length > 25
                                      ? getFileNameFromURL(file).substring(
                                          0,
                                          20
                                        ) +
                                        '...' +
                                        getFileNameFromURL(file).substring(
                                          getFileNameFromURL(file).length - 7,
                                          getFileNameFromURL(file).length
                                        )
                                      : getFileNameFromURL(file)}
                                  </a>
                                  <span className='text-xs italic'>
                                    &nbsp;(By Agent)
                                  </span>
                                </p>
                              );
                            })}
                        </>
                      ) : cellData && cellData.length > 0 ? (
                        cellData.map((file, fileIndex) => {
                          const getFileNameFromURL = (url) => {
                            const parts = url.split('/');
                            return parts[parts.length - 1];
                          };
                          return (
                            <p key={fileIndex}>
                              <a
                                target='_blank'
                                className='text-sm text-blue-500 underline'
                                href={file}
                                title={getFileNameFromURL(file)}
                              >
                                {getFileNameFromURL(file).length > 30
                                  ? getFileNameFromURL(file).substring(0, 20) +
                                    '...' +
                                    getFileNameFromURL(file).substring(
                                      getFileNameFromURL(file).length - 7,
                                      getFileNameFromURL(file).length
                                    )
                                  : getFileNameFromURL(file)}
                              </a>
                            </p>
                          );
                        })
                      ) : (
                        'NA'
                      )
                    ) : header === 'Done' ? (
                      <button
                        onClick={() =>
                          stage === 'working'
                            ? handleWorkDone(rowIndex, rowData)
                            : stage === 'submit' &&
                              handleSubmitDone(rowIndex, rowData)
                        }
                        className='ml-2 px-4 py-1 bg-blue-500 text-white rounded'
                      >
                        Done
                      </button>
                    ) : header === 'ARN Number' && stage === 'submit' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={arnValues[rowIndex] || ''}
                        onChange={(e) =>
                          handleArnChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter ARN No.'
                        className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                      />
                    ) : header === 'ARN Number' && stage === 'completed' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={rowData.arnNumber}
                        disabled
                        className='w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                      />
                    ) : header === 'Note' && stage === 'working' ? (
                      <textarea
                        type='text'
                        name='currentNote'
                        value={noteValues[rowIndex] || cellData}
                        onChange={(e) =>
                          handleNoteChange(rowIndex, e.target.value)
                        }
                        className='w-full w-52 mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                      />
                    ) : (
                      (cellData && cellData) || ' - '
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponentService;
