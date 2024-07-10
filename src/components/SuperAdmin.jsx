import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable, usePagination, useFilters } from 'react-table';
import ReactPaginate from 'react-paginate';
import AddAdminModal from './AddAdminModal';
import * as api from '../api';

const SuperAdmin = ({ access }) => {
  const dispatch = useDispatch();
  const entitiyId = useSelector((state) => state.auth.authData.entityID);
  const userData = useSelector((state) => state.auth.authData);
  const [services, setServices] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5); // Changed to 5 items per page
  const [filterInput, setFilterInput] = useState('');

  useEffect(() => {
    try {
      api.fetchAllServices().then(({ data }) => {
        data.statusCode == 200 && setServices(data.data.services);
      });
      api.fetchAllForSuperAdmin('admin').then(({ data }) => {
        data.statusCode == 200 && setAdminData(data.data.admins);
        const admins = data.data.admins;
        setPageCount(Math.ceil(admins.length / itemsPerPage));
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, itemsPerPage]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value || '';
    setFilterInput(value);
  };

  const filteredData = useMemo(
    () =>
      adminData.filter((admin) =>
        admin.name.toLowerCase().includes(filterInput.toLowerCase())
      ),
    [adminData, filterInput]
  );

  const currentData = useMemo(
    () =>
      filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      ),
    [filteredData, currentPage, itemsPerPage]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Alt Phone',
        accessor: 'altPhone',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },

      {
        Header: 'Client Count',
        accessor: 'clientCount',
      },
      {
        Header: 'Agent Count',
        accessor: 'agentCount',
      },
      {
        Header: 'GST Number',
        accessor: 'gstNumber',
      },
      {
        Header: 'Reverse Charge',
        accessor: 'reverseCharge',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      {
        columns,
        data: currentData,
        initialState: { pageIndex: 0 },
      },
      useFilters,
      usePagination
    );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <AddAdminModal
        showModal={showModal}
        services={services}
        closeModal={closeModal}
      />
      <div className='p-4 h-[91vh]'>
        <div
          className='flex justify-between items-center font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700 clients-container'
          style={{ borderColor: '#41506b' }}
        >
          <div>
            Welcome,{' '}
            <span className='text-blue-400'>
              {userData?.entity?.name || userData.username}
            </span>
          </div>
          <div
            className='p-2 bg-green-300 hover:bg-green-400 cursor-pointer rounded-md text-xs'
            onClick={openModal}
          >
            Register Admin
          </div>
        </div>

        <div className='p-4 flex flex-col'>
          <div className='mb-4'>
            <input
              value={filterInput}
              onChange={handleFilterChange}
              placeholder={'Search by name'}
              className='p-2 border border-gray-300 rounded-md w-full'
            />
          </div>
          <div className='overflow-x-auto'>
            <table {...getTableProps()} className='min-w-full leading-normal'>
              <thead>
                {headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...restHeaderGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key, ...restColumnProps } =
                          column.getHeaderProps();
                        return (
                          <th
                            key={key}
                            {...restColumnProps}
                            className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'
                          >
                            {column.render('Header')}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restRowProps}>
                      {row.cells.map((cell) => {
                        const { key, ...restCellProps } = cell.getCellProps();
                        return (
                          <td
                            key={key}
                            {...restCellProps}
                            className='px-5 py-5 border-b border-gray-200 bg-white text-sm'
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='flex justify-center mt-4'>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination flex items-center space-x-2'}
              pageClassName={'page-item'}
              pageLinkClassName={
                'page-link py-2 px-4 border border-gray-300 rounded-lg text-blue-500 hover:bg-gray-100'
              }
              previousClassName={'page-item'}
              previousLinkClassName={
                'page-link py-2 px-4 border border-gray-300 rounded-lg text-blue-500 hover:bg-gray-100'
              }
              nextClassName={'page-item'}
              nextLinkClassName={
                'page-link py-2 px-4 border border-gray-300 rounded-lg text-blue-500 hover:bg-gray-100'
              }
              disabledClassName={'disabled opacity-50 cursor-not-allowed'}
              activeClassName={'active text-blue-500 font-bold'} // Remove background color
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdmin;
