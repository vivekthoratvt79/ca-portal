import React from 'react';

const TableComponentService = ({ headers, data }) => {
  // Mapping headers to the keys in the data objects
  const keyMap = {
    'Sr No.': 'index',
    'Client Name': 'clientName',
    'Data Provider Name': 'dataProviderName',
    Number: 'clientNumber',
    Upload: 'upload', // Assuming 'upload' is a placeholder for file input
    View: 'clientUploadArray', // Assuming '_id' can be used uniquely for identifying rows
    'Past Note': 'pastNote',
    Working: 'currentNote',
    Note: 'currentNote',
    Done: 'currentNote',
    'ARN Number': 'arnNumber',
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
                    className='px-4 py-2 border border-gray-300 text-center'
                  >
                    {header === 'Upload' ? (
                      <input
                        type='file'
                        className='text-xs text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-small file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700'
                        onChange={(e) => {
                          let file = e.target.files[0];
                          console.log('file', file);
                        }}
                      />
                    ) : header === 'View' ? (
                      (cellData.length > 0 &&
                        cellData.map((file) => <p>{file}</p>)) ||
                      'NA'
                    ) : (
                      cellData
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
