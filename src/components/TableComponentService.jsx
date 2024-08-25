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
  const [imgErrors, setImgErrors] = useState({});
  const [clientUploadErrors, setClientUploadErrors] = useState({});
  const [cinErrors, setCinErrors] = useState({});
  const [cinValues, setCinValues] = useState({});
  const [arnErrors, setArnErrors] = useState({});
  const [arnValues, setArnValues] = useState({});
  const [r9ArnErrors, setr9ArnErrors] = useState({});
  const [r9ArnValues, setr9ArnValues] = useState({});
  const [r9cArnErrors, setr9cArnErrors] = useState({});
  const [r9cArnValues, setr9cArnValues] = useState({});
  const [acknowledgementErrors, setAcknowledgementErrors] = useState({});
  const [acknowledgementValues, setAcknowledgementValues] = useState({});
  const [noteValues, setNoteValues] = useState({});
  const [taxErrors, setTaxErrors] = useState({});
  const [taxValues, setTaxValues] = useState({});

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
    Paid: 'paid',
    'ARN Number': 'arnNumber',
    'Tax Amount': 'taxAmount',
    'R9 ARN No.': 'r9arnNumber',
    'R9C ARN No.': 'r9carnNumber',
    'Doc Upload': 'docUpload',
    'CIN No.': 'CINNumber',
    'CIN Number': 'CINNumber',
    CIN: 'cinDocumentUploadArray',
    'Acknowledgement No.': 'acknowledgementNumber',
    Acknowledgement: 'acknowledgementUpload',
  };

  const handleFileChange = (rowIndex, files) => {
    setClientUploadErrors({ [rowIndex]: '' });
    setSelectedFiles((prev) => ({
      ...prev,
      [rowIndex]: files,
    }));
  };

  const handleFileChangeforAdmin = (rowIndex, files) => {
    setImgErrors({ [rowIndex]: '' });
    setAdminSelectedFiles((prev) => ({
      ...prev,
      [rowIndex]: files,
    }));
  };

  const handleUpload = async (rowIndex, rowData, e) => {
    const files = selectedFiles[rowIndex];
    if (!files || !files.length) {
      console.log(files);
      setClientUploadErrors({ [rowIndex]: 'Please Upload Image' });
      return;
    }
    e.target.innerText = 'Uploading...';
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
      e.target.innerText = 'Upload';
      console.error('Error uploading files:', error);
    }
  };

  const handleWorkDone = async (rowIndex, rowData, e) => {
    const files = adminSelectedFiles[rowIndex];

    if (!files || !files.length) {
      setImgErrors({ [rowIndex]: 'Please Upload Image' });
      return;
    }
    const formData = new FormData();

    if (service == 'gstr9' || service == 'tds' || service == 'ptrc') {
      if (!taxValues[rowIndex]) {
        setTaxErrors({ [rowIndex]: 'Tax Amount is required' });
        return;
      } else {
        formData.append('taxAmount', taxValues[rowIndex]);
      }
    }

    let { adminRef, _id, clientRef, agentRef, serviceRef } = rowData;
    if (service == 'gst2b' || service == 'gst2bpr') {
      formData.append('clientRef', clientRef);
      formData.append('serviceRef', serviceRef);
      formData.append('agentRef', agentRef);
    }
    formData.append('adminRef', adminRef);
    formData.append('currentNote', noteValues[rowIndex] || '');
    formData.append('orderRef', _id);

    // Append files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response =
        service === 'gst2b' || service === 'gst2bpr'
          ? await api.postDocSending(formData, service)
          : await api.postWorkingStageDetails(formData, service);
      console.log('Work response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handleDocUpload = async (rowIndex, rowData, e) => {
    const files = adminSelectedFiles[rowIndex];
    const formData = new FormData();

    if (!files || !files.length) {
      setImgErrors({ [rowIndex]: 'Please Upload Image' });
      return;
    }

    if (service == 'vat') {
      if (!acknowledgementValues[rowIndex]) {
        setAcknowledgementErrors({ [rowIndex]: 'Tax Amount is required' });
        return;
      } else {
        formData.append(
          'acknowledgementNumber',
          acknowledgementValues[rowIndex]
        );
      }
    }

    let { adminRef, _id, clientRef, agentRef, serviceRef } = rowData;
    formData.append('clientRef', clientRef);
    formData.append('serviceRef', serviceRef);
    formData.append('agentRef', agentRef);
    formData.append('adminRef', adminRef);
    formData.append('orderRef', _id);

    // Append files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response = await api.postDocSending(formData, service);
      console.log('Work response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handleDocSubmit = async (rowIndex, rowData, e) => {
    const files = adminSelectedFiles[rowIndex];

    if (!files || !files.length) {
      setImgErrors({ [rowIndex]: 'Please Upload Image' });
      return;
    }
    const formData = new FormData();

    if (!cinValues[rowIndex]) {
      setCinErrors({ [rowIndex]: 'CIN No is required' });
      return;
    } else {
      formData.append('CINNumber', cinValues[rowIndex]);
    }

    let { adminRef, _id, clientRef, agentRef, serviceRef } = rowData;

    formData.append('adminRef', adminRef);
    formData.append('orderRef', _id);
    // Append files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const response = await api.postSubmitStageDetails(formData, service);
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
    switch (service) {
      case 'gstr1':
      case 'gst3b':
        formData.arnNumber = arnValues[rowIndex];
        break;
      case 'gstr9':
        formData.r9ArnNumber = r9ArnValues[rowIndex];
        formData.r9cArnNumber = r9cArnValues[rowIndex];
        break;
      default:
        break;
    }
    if (!arnValues[rowIndex] && service != 'gstr9') {
      setArnErrors({ [rowIndex]: 'ARN Number is required' });
      return;
    }
    if (service == 'gstr9' && !r9ArnValues[rowIndex]) {
      setr9ArnErrors({ [rowIndex]: 'ARN Number is required' });
      return;
    }
    if (service == 'gstr9' && !r9cArnValues[rowIndex]) {
      setr9cArnErrors({ [rowIndex]: 'ARN Number is required' });
      return;
    }

    try {
      const response = await api.postSubmitStageDetails(formData, service);
      console.log('Submit response:', response);
      setServices([...services]);
    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handlePaymentDone = async (rowIndex, rowData) => {
    const formData = {};
    let { _id } = rowData;
    formData.orderRef = _id;
    try {
      const response = await api.postPaymentStageDetails(formData, service);
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

  const handleCinChange = (rowIndex, value) => {
    setCinErrors({ [rowIndex]: '' });
    setCinValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleArnChange = (rowIndex, value) => {
    setArnErrors({ [rowIndex]: '' });
    setArnValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handler9ArnChange = (rowIndex, value) => {
    setr9ArnErrors({ [rowIndex]: '' });
    setr9ArnValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handler9cArnChange = (rowIndex, value) => {
    setr9cArnErrors({ [rowIndex]: '' });
    setr9cArnValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleAcknowledgementChange = (rowIndex, value) => {
    setAcknowledgementErrors({ [rowIndex]: '' });
    setAcknowledgementValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleTaxChange = (rowIndex, value) => {
    setTaxErrors({ [rowIndex]: '' });
    setTaxValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  return !data.length ? (
    <div className='overflow-x-auto max-h-[575px]'>
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
          <tr>
            {headers.map((header, index) => (
              <td
                key={index}
                className={`px-4 py-2 border border-gray-300 text-center`}
              >
                -
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div className='overflow-x-auto max-h-[575px]'>
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
                      <div
                        className={`flex items-center font-semibold ${
                          clientUploadErrors[rowIndex]
                            ? 'text-red-600 '
                            : 'text-stone-500 '
                        }`}
                      >
                        <input
                          type='file'
                          multiple='multiple'
                          accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                          className='text-xs file:mr-2 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-small file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700'
                          onChange={(e) =>
                            handleFileChange(rowIndex, e.target.files)
                          }
                        />
                        <button
                          onClick={(e) => handleUpload(rowIndex, rowData, e)}
                          className='ml-2 text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                          Upload
                        </button>
                      </div>
                    ) : header === 'Admin Upload' ||
                      header === 'Doc Upload' ||
                      header == 'CIN' ||
                      header == 'Acknowledgement' ? (
                      <div
                        className={`flex items-center w-52 font-semibold ${
                          imgErrors[rowIndex]
                            ? 'text-red-600 '
                            : 'text-stone-500 '
                        }`}
                      >
                        <input
                          type='file'
                          multiple='multiple'
                          accept='image/jpeg,image/gif,image/png,application/pdf,image/x-eps'
                          className='text-xs  file:mr-2 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-small file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700'
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
                                <p
                                  key={fileIndex}
                                  className='client-upload mb-2'
                                >
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
                                  <span className='text-xs italic'>
                                    &nbsp;(By Client)
                                  </span>
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
                                  className='whitespace-nowrap admin-upload mb-1'
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
                          {rowData.clientDocumentSendArray &&
                            rowData.clientDocumentSendArray.length > 0 &&
                            rowData.clientDocumentSendArray.map(
                              (file, fileIndex) => {
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
                              }
                            )}
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
                      <>
                        <button
                          onClick={(e) =>
                            stage === 'working'
                              ? handleWorkDone(rowIndex, rowData, e)
                              : stage == 'doc'
                              ? handleDocUpload(rowIndex, rowData, e)
                              : stage === 'submit' &&
                                (service == 'tds' ||
                                  service == 'ptrc' ||
                                  service == 'ptec')
                              ? handleDocSubmit(rowIndex, rowData, e)
                              : stage === 'submit' &&
                                handleSubmitDone(rowIndex, rowData)
                          }
                          className='ml-2 px-4 py-0.5 bg-blue-500 text-sm text-white rounded'
                        >
                          Done
                        </button>
                        {stage === 'working' && (
                          <button
                            onClick={(e) =>
                              handleWorkDone(rowIndex, rowData, e)
                            }
                            className='ml-2 px-4 mt-1 py-0.5 bg-blue-500 text-sm text-white rounded'
                          >
                            Approve
                          </button>
                        )}
                      </>
                    ) : header === 'Payment' && stage == 'payment' ? (
                      <button
                        onClick={(e) => handlePaymentDone(rowIndex, rowData)}
                        className='ml-2 px-4 py-1 bg-blue-500 text-white rounded'
                      >
                        Paid
                      </button>
                    ) : header === 'CIN No.' && stage === 'submit' ? (
                      <input
                        type='text'
                        name='cinNumber'
                        value={cinValues[rowIndex] || ''}
                        onChange={(e) =>
                          handleCinChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter CIN No.'
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          cinErrors[rowIndex] ? 'border border-red-500' : ''
                        }`}
                      />
                    ) : header === 'ARN Number' && stage === 'submit' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={arnValues[rowIndex] || ''}
                        onChange={(e) =>
                          handleArnChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter ARN No.'
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          arnErrors[rowIndex] ? 'border border-red-500' : ''
                        }`}
                      />
                    ) : header === 'ARN Number' && stage === 'completed' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={rowData.arnNumber}
                        disabled
                        className='w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                      />
                    ) : header === 'R9 ARN No.' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={
                          stage == 'completed'
                            ? rowData.r9ArnNumber
                            : r9ArnValues[rowIndex] || ''
                        }
                        disabled={stage == 'completed' ? true : false}
                        onChange={(e) =>
                          handler9ArnChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter R9 ARN No.'
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          r9ArnErrors[rowIndex] ? 'border border-red-500' : ''
                        }`}
                      />
                    ) : header === 'R9C ARN No.' ? (
                      <input
                        type='text'
                        name='arnNumber'
                        value={
                          stage == 'completed'
                            ? rowData.r9cArnNumber
                            : r9cArnValues[rowIndex] || ''
                        }
                        disabled={stage == 'completed' ? true : false}
                        onChange={(e) =>
                          handler9cArnChange(rowIndex, e.target.value)
                        }
                        placeholder='R9C ARN No.'
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          r9cArnErrors[rowIndex] ? 'border border-red-500' : ''
                        }`}
                      />
                    ) : header === 'Acknowledgement No.' ? (
                      <input
                        type='text'
                        name='acknowledgementNo'
                        value={
                          stage == 'completed'
                            ? rowData.acknowledgementNumber
                            : acknowledgementValues[rowIndex] || ''
                        }
                        disabled={stage == 'completed' ? true : false}
                        onChange={(e) =>
                          handleAcknowledgementChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter Acknowledgement No.'
                        className={`w-[200px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          acknowledgementErrors[rowIndex]
                            ? 'border border-red-500'
                            : ''
                        }`}
                      />
                    ) : header === 'Note' && stage === 'working' ? (
                      <textarea
                        type='text'
                        name='currentNote'
                        value={noteValues[rowIndex] || cellData || ''}
                        onChange={(e) =>
                          handleNoteChange(rowIndex, e.target.value)
                        }
                        className='w-52 mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
                      />
                    ) : header === 'Tax Amount' && stage == 'completed' ? (
                      <input
                        type='text'
                        name='taxAmount'
                        value={rowData.taxAmount || ''}
                        disabled
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 `}
                      />
                    ) : header === 'Tax Amount' ? (
                      <input
                        type='text'
                        name='taxAmount'
                        value={taxValues[rowIndex] || ''}
                        onChange={(e) =>
                          handleTaxChange(rowIndex, e.target.value)
                        }
                        placeholder='Enter Tax Amount'
                        className={`w-[150px] mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 ${
                          taxErrors[rowIndex] ? 'border border-red-500' : ''
                        }`}
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
