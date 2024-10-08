import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as api from '../api';

const Sidebar = ({ activeTab, access }) => {
  useEffect(() => {
    if (
      activeTab == 'r1' ||
      activeTab == '3b' ||
      activeTab == 'r9' ||
      activeTab == '2b' ||
      activeTab == '2bpr'
    ) {
      let el = document.getElementById('dropdown-gst');
      el.classList.remove('hidden');
    }
    if (activeTab == 'individual' || activeTab == 'company') {
      let el = document.getElementById('dropdown-income-tax');
      el.classList.remove('hidden');
    }
  }, []);

  const userRole = useSelector((state) => state.auth.authData.role);
  const user = useSelector((state) => state.auth.authData);

  let serviceMap = {
    r1: '667483e2609dcd4a40b05c64',
    '3b': '667483d2609dcd4a40b05c62',
    '2b': '66858c3035f53ae42ba97581',
    '2bpr': '6685951f91d157c517a367bb',
    r9: '6686f4a7c5d5e071b4bdf6aa',
    vat: '66879aa59e1857d85d16eb6b',
    consul: '66879ea69e1857d85d16eb6f',
    ptrc: '668991319a14ed912d5d0eb8',
    ptec: '66899bcc9a14ed912d5d0ec0',
    accounting: '6689a6369a14ed912d5d0ec3',
  };

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
            {access.includes('dashboard') && (
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
            )}
            {userRole != 'client' && (
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
                    width='24'
                    height='24'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2 8v-2h7v2H4Zm0 2v2h7v-2H4Zm9 2h7v-2h-7v2Zm7-4v-2h-7v2h7Z'
                      clipRule='evenodd'
                    />
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
                  {userRole != 'agent' ||
                  user.entity.serviceRefs.includes(serviceMap.r1) ? (
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
                  ) : (
                    ''
                  )}

                  {userRole != 'agent' ||
                  user.entity.serviceRefs.includes(serviceMap['3b']) ? (
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
                  ) : (
                    ''
                  )}

                  {userRole != 'agent' ||
                  user.entity.serviceRefs.includes(serviceMap.r9) ? (
                    <li>
                      <NavLink
                        to='/gst/r9'
                        className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                          activeTab == 'r9'
                            ? 'bg-gray-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                        }`}
                      >
                        R9 / R9C
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}

                  {userRole != 'agent' ||
                  user.entity.serviceRefs.includes(serviceMap['2b']) ? (
                    <li>
                      <NavLink
                        to='/gst/2b'
                        className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                          activeTab == '2b'
                            ? 'bg-gray-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                        }`}
                      >
                        2B
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}

                  {userRole != 'agent' ||
                  user.entity.serviceRefs.includes(serviceMap['2bpr']) ? (
                    <li>
                      <NavLink
                        to='/gst/2bpr'
                        className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-11 group dark:text-white ${
                          activeTab == '2bpr'
                            ? 'bg-gray-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                        }`}
                      >
                        2B vs Purchase Register
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </li>
            )}
            {/* {userRole != 'client' && (
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
            )} */}
            {userRole != 'client' && (
              <>
                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.tds) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'tds'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/tds'
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
                        TDS / TCS
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.vat) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'vat'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/vat'
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
                      <span className='flex-1 ms-3 whitespace-nowrap'>VAT</span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.consul) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'consultancy'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/consultancy'
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
                        Consultancy
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.ptrc) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'ptrc'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/ptrc'
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
                        PTRC
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.ptec) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'ptec'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/ptec'
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
                        PTEC
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                {userRole != 'agent' ||
                user.entity.serviceRefs.includes(serviceMap.accounting) ? (
                  <li>
                    <NavLink
                      className={`flex items-center p-2 rounded-lg dark:text-white group ${
                        activeTab == 'accounting'
                          ? 'bg-gray-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                      }`}
                      to='/accounting'
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
                        Accounting
                      </span>
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
              </>
            )}

            {userRole != 'client' && (
              <li>
                <NavLink
                  className={`flex items-center p-2 rounded-lg dark:text-white group ${
                    activeTab == 'tasks'
                      ? 'bg-gray-300 text-black'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black custom-txt-color'
                  }`}
                  to='/tasks'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z' />
                    <path d='M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z' />
                    <path d='M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z' />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Tasks</span>
                </NavLink>
              </li>
            )}

            {access.includes('clients') && (
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
            )}

            {access.includes('agents') && (
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
                  <span className='flex-1 ms-3 whitespace-nowrap'>
                    Employees
                  </span>
                </NavLink>
              </li>
            )}

            {access.includes('managers') && (
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

            {access.includes('billings') && (
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
                    width='24'
                    height='24'
                    fill='none'
                    viewBox='4 4 18 18'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z'
                    />
                  </svg>

                  <span className='flex-1 ms-3 whitespace-nowrap'>Billing</span>
                </NavLink>
              </li>
            )}
            {/* <li>
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
            </li> */}
            {access.includes('settings') && (
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
                    width='24'
                    height='24'
                    fill='currentColor'
                    viewBox='4 4 18 18'
                  >
                    <path
                      fillRule='evenodd'
                      d='M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z'
                      clipRule='evenodd'
                    />
                  </svg>

                  <span className='flex-1 ms-3 whitespace-nowrap'>
                    Settings
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
