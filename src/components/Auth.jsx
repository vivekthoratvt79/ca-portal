import React, { useState } from 'react';
import loginImg from '../Images/login-desktop.png';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { signin } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputClasses =
    'w-full p-3 pl-10 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500';
  const iconClasses = 'w-5 h-5 text-zinc-500 dark:text-zinc-400';
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(signin(formData, navigate)).then((data) => {
      if (data?.response?.status == 401) {
        setError(data?.response?.data?.message);
      }
      setLoading(false);
    });

    setTimeout(() => {
      setLoading(false);
      setError('');
    }, 3000);
  };

  return (
    <div className='flex items-center justify-center h-[91vh]'>
      <div className='bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-8 flex space-x-8 items-center max-w-xl'>
        <div className='hidden md:block'>
          <img
            src={loginImg}
            alt='icon'
            className='w-96 h-48 object-contain mx-auto'
          />
        </div>
        <div className='w-full max-w-sm text-center'>
          <h2 className='text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-200'>
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='email' className='sr-only'>
                Email
              </label>
              <div className='relative'>
                <input
                  type='text'
                  id='username'
                  name='username'
                  className={inputClasses}
                  placeholder='Username'
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <svg
                    className={iconClasses}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M2.94 6.94a1.5 1.5 0 000 2.12l5.66 5.66a1.5 1.5 0 002.12 0l5.66-5.66a1.5 1.5 0 000-2.12l-5.66-5.66a1.5 1.5 0 00-2.12 0L2.94 6.94zM10 12.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className='mb-6'>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder='Password'
                />
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <svg
                    className={iconClasses}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 2a4 4 0 00-4 4v2H5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3v-6a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            {loading ? (
              <Loader />
            ) : error ? (
              <div className='flex justify-center text-center text-red-400'>
                {error}
              </div>
            ) : (
              <button
                type='submit'
                className='w-full text-sm p-3 bg-cyan-400 text-white rounded-lg font-semibold hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-600'
              >
                LOGIN
              </button>
            )}
            {/* <div className='mt-4 text-center'>
              <a
                href='#'
                className='text-sm text-zinc-600 dark:text-zinc-400 hover:underline'
              >
                Forgot Username / Password?
              </a>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
