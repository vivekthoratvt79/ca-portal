import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ activeTab }) => {
  const userRole = useSelector((state) => state.auth.authData.role);
  useEffect(() => {
    if (
      activeTab == 'r1' ||
      activeTab == '3b' ||
      activeTab == '9r' ||
      activeTab == '9rc'
    ) {
      let el = document.getElementById('dropdown-gst');
      el.classList.remove('hidden');
    }
    if (activeTab == 'individual' || activeTab == 'company') {
      let el = document.getElementById('dropdown-income-tax');
      el.classList.remove('hidden');
    }
  }, []);
  return (
    <>
      <button
        data-drawer-target='sidebar-multi-level-sidebar'
        data-drawer-toggle='sidebar-multi-level-sidebar'
        aria-controls='sidebar-multi-level-sidebar'
        type='button'
        className='inline-flex items-center p-2 mt-2 ms-3 text-sm  rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
        onClick={() => {
          let el = document.getElementById('sidebar-multi-level-sidebar');
          let clsExist = el.classList.contains('-translate-x-full');
          if (clsExist) {
            el.classList.remove('-translate-x-full');
            el.classList.add('side-menu-mobile');
          } else {
            el.classList.add('-translate-x-full');
            el.classList.remove('side-menu-mobile');
          }
        }}
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
          ></path>
        </svg>
      </button>
      <aside
        id='sidebar-multi-level-sidebar'
        className='custom-bg-color absolute left-0 z-40 w-64 sm:translate-x-0 h-91vh transition-transform -translate-x-full'
        aria-label='Sidebar'
        style={{ borderRight: '1px solid #d9f2ff' }}
      >
        <div className='h-full px-3 py-4 overflow-y-auto'>
          <ul className='space-y-2 font-light'>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'dashboard'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/'
              >
                <svg
                  className='w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 21'
                >
                  <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                  <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                </svg>
                <span className='ms-3'>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <button
                type='button'
                className='custom-txt-color flex items-center w-full p-2 text-base transition duration-75 rounded-lg group dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black'
                aria-controls='dropdown-gst'
                data-collapse-toggle='dropdown-gst'
                onClick={() => {
                  let el = document.getElementById('dropdown-gst');
                  if (el.offsetParent === null) {
                    el.classList.remove('hidden');
                  } else {
                    el.classList.add('hidden');
                  }
                }}
              >
                <svg
                  className='flex-shrink-0 w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 21'
                >
                  <path d='M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z' />
                </svg>
                <span className='flex-1 ms-3 text-left rtl:text-right whitespace-nowrap'>
                  GST
                </span>
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  fill='none'
                  viewBox='0 0 10 6'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
              <ul id='dropdown-gst' className='hidden py-2 space-y-2'>
                <li>
                  <NavLink
                    to='/gst/r1'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == 'r1'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    R1
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gst/3b'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == '3b'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    3B
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to='/gst/9r'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == '9r'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    9R
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/gst/9rc'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == '9rc'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    9RC
                  </NavLink>
                </li> */}
              </ul>
            </li>
            <li>
              <button
                type='button'
                className='custom-txt-color flex items-center w-full p-2 text-base transition duration-75 rounded-lg group dark:text-white dark:hover:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black'
                aria-controls='dropdown-income-tax'
                data-collapse-toggle='dropdown-income-tax'
                onClick={() => {
                  let el = document.getElementById('dropdown-income-tax');
                  if (el.offsetParent === null) {
                    el.classList.remove('hidden');
                  } else {
                    el.classList.add('hidden');
                  }
                }}
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 21'
                >
                  <path d='M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z' />
                </svg>
                <span className='flex-1 ms-3 text-left rtl:text-right whitespace-nowrap'>
                  Income Tax
                </span>
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  fill='none'
                  viewBox='0 0 10 6'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
              <ul id='dropdown-income-tax' className='hidden py-2 space-y-2'>
                <li>
                  <NavLink
                    to='/tax/individual'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == 'individual'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    Individual
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/tax/company'
                    className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                      activeTab == 'company'
                        ? 'bg-gray-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                    }`}
                  >
                    Company
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'loan'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/loan'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>
                  Loan Application
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={`navbar-brand mr-auto flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'clients'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/clients'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>Clients</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'employees'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/employees'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>Employees</span>
              </NavLink>
            </li>

            {userRole && userRole == 'admin' && (
              <li>
                <NavLink
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    activeTab == 'managers'
                      ? 'bg-gray-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                  }`}
                  to='/managers'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 18'
                  >
                    <path d='M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z' />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>
                    Managers
                  </span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'income'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/income'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 20'
                >
                  <path d='M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>Income</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'expenditure'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/expenditure'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 20'
                >
                  <path d='M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z' />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>
                  Expenditure
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`flex items-center p-2 rounded-lg dark:text-white group ${
                  activeTab == 'settings'
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                }`}
                to='/settings'
              >
                <svg
                  className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 16'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3'
                  />
                </svg>
                <span className='flex-1 ms-3 whitespace-nowrap'>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
