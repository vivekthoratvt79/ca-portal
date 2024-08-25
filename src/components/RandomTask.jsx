import React, { useEffect, useState } from 'react';
import * as api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForAdmin } from '../actions/managers';
import Sidebar from './Sidebar';

const RandomTask = ({ access }) => {
  const storageData = [40, 60]; // Used, Available
  const msgData = [37, 100]; // Used, Available
  const emailData = [20, 100]; // Used, Available
  const whatsappData = [80, 100]; // Used, Available

  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6; // Number of tasks per page

  const dispatch = useDispatch();

  let user = useSelector((state) => state.auth.authData);
  const entityId = useSelector((state) => state.auth.authData.entityID);
  const userRole = useSelector((state) => state.auth.authData.role);
  const employees = useSelector((state) => state.employees);

  const taskHeaders =
    userRole == 'agent'
      ? ['Client', 'Description', 'Status']
      : ['Agent', 'Client', 'Description', 'Status'];

  const keyMap = {
    Agent: 'agentRef',
    Client: 'clientName',
    Description: 'description',
    Status: 'status',
  };

  useEffect(() => {
    if (userRole == 'admin') {
      dispatch(fetchForAdmin('agent', entityId));
      api.getAllTasksOfAdmin(entityId).then(({ data }) => {
        setTasks(data.data.tasks);
      });
    } else if (userRole == 'agent') {
      api.getAllTasksOfAgent(entityId).then(({ data }) => {
        setTasks(data.data.tasks);
      });
    } else if (userRole == 'manager') {
      dispatch(fetchForAdmin('agent', user.entity.adminRef));
      api.getAllTasksOfAdmin(user.entity.adminRef).then(({ data }) => {
        setTasks(data.data.tasks);
      });
    }
  }, [entityId]);

  // Calculate the current tasks to display
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleStatusChange = (taskId, newStatus) => {
    let payload = {
      taskRef: taskId,
      status: newStatus,
    };
    api
      .updateTask(payload)
      .then(() => {
        // Update the status in the local state after successful API call
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch((error) => {
        console.error('Failed to update status:', error);
      });
  };

  return (
    <>
      <Sidebar activeTab='tasks' access={access} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <div
          className='items-center flex justify-between font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700'
          style={{ borderColor: '#41506b' }}
        >
          Random Tasks
        </div>
        <div className=''>
          <div className='w-100 mt-4'>
            <table className='table-auto w-full border-collapse mt-2'>
              <thead>
                <tr>
                  {taskHeaders.map((header, index) => (
                    <th
                      key={index}
                      className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              {currentTasks.length === 0 ? (
                <tbody>
                  <tr>
                    {taskHeaders.map((header, index) => (
                      <td
                        key={index}
                        className='px-4 py-2 border border-gray-300 text-center'
                      >
                        -
                      </td>
                    ))}
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentTasks.map((rowData, rowIndex) => (
                    <tr key={rowIndex}>
                      {taskHeaders.map((header, cellIndex) => {
                        const cellData = rowData[keyMap[header]] || '-';

                        return header === 'Status' && userRole === 'agent' ? (
                          <td
                            key={cellIndex}
                            className='px-4 py-2 border border-gray-300 text-center'
                          >
                            <select
                              className='w-100'
                              value={cellData}
                              onChange={(e) =>
                                handleStatusChange(rowData._id, e.target.value)
                              }
                              style={{
                                background: 'transparent',
                                outline: 'none',
                              }}
                            >
                              <option key='open' value='open'>
                                Open
                              </option>
                              <option key='inprogress' value='inprogress'>
                                In Progress
                              </option>
                              <option key='closed' value='closed'>
                                Closed
                              </option>
                            </select>
                          </td>
                        ) : header === 'Status' ? (
                          <td
                            key={cellIndex}
                            className='px-4 py-2 border border-gray-300 text-center'
                          >
                            {cellData === 'open' && 'Open'}
                            {cellData === 'inprogress' && 'In Progress'}
                            {cellData === 'closed' && 'Closed'}
                          </td>
                        ) : header === 'Agent' && employees.length ? (
                          <td
                            key={cellIndex}
                            className='px-4 py-2 border border-gray-300 text-center'
                          >
                            {employees.find(
                              (employee) => cellData === employee._id
                            )?.name || '-'}
                          </td>
                        ) : (
                          <td
                            key={cellIndex}
                            className='px-4 py-2 border border-gray-300 text-center'
                          >
                            {cellData}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {/* Pagination Controls */}
            <div className='flex justify-between mt-4'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded'
              >
                Previous
              </button>
              <div className='flex items-center'>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className='px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RandomTask;
