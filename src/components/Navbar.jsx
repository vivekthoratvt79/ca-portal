import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signout } from '../actions/auth';
import { useDispatch } from 'react-redux';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;
  return (
    <nav
      className={`${
        smallScreen ? 'h-[6vh]' : 'h-[7vh]'
      } custom-bg-color navbar-container bg-gray-50 py-2 `}
      style={{ borderBottom: '1px solid #d9f2ff' }}
    >
      <div className='mx-auto px-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <NavLink to='/' className='custom-txt-color text-xl font-normal'>
              CA Management Portal
            </NavLink>
          </div>
          {user ? (
            <div className='flex items-center md:gap-4 custom-txt-color'>
              <svg
                className='w-8 h-8 -left-1'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <div className='text-md dark:text-white'>
                <button
                  type='button'
                  onClick={() => dispatch(signout(navigate))}
                  className='px-2 py-0.5 float-right text-xs text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
                >
                  Signout
                </button>
              </div>
            </div>
          ) : (
            <div className='custom-txt-color'>Login</div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
