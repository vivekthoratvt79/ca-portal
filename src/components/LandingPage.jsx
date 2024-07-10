import React, { useEffect, useState } from 'react';
import landingPageImg from '../Images/landingPage.png';
import * as api from '../api';

function LandingPage({ subdomain }) {
  const [adminData, setAdminData] = useState({});
  function getBaseURL() {
    let url = window.location.href;
    try {
      const parsedUrl = new URL(url);

      // Handle special case for localhost with subdomains
      if (parsedUrl.hostname.includes('.localhost')) {
        parsedUrl.hostname = 'localhost';
      } else {
        // Handle general cases with subdomains
        const hostnameParts = parsedUrl.hostname.split('.');
        if (hostnameParts.length > 2) {
          // Remove the first part (subdomain)
          hostnameParts.shift();
          parsedUrl.hostname = hostnameParts.join('.');
        }
      }

      // Construct the base URL
      const protocol =
        parsedUrl.protocol === 'http:' ? 'http:' : parsedUrl.protocol;
      return `${protocol}//${parsedUrl.hostname}${
        parsedUrl.port ? `:${parsedUrl.port}` : ''
      }/`;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }

  useEffect(() => {
    try {
      api
        .getAdminDetailsWithUsername(subdomain)
        .then(({ data }) => {
          setAdminData(data.data.admin);
          console.log(data.data.admin);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return !Object.keys(adminData).length ? (
    <div className='bg-gray-100 min-h-screen'>
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-sm md:text-2xl font-bold text-gray-800'>
            CA Services
          </h1>
          <nav>
            <a href='#services' className='text-gray-800 mx-2'>
              Services
            </a>

            <a
              href={getBaseURL()}
              className='bg-teal-600 text-white py-2 px-4 rounded ml-4'
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      <main className='container mx-auto px-4 py-10'>
        <section
          id='hero'
          className='text-center py-10 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg mb-10 shadow-md'
        >
          <div className='flex flex-col gap-6 md:flex-row justify-evenly items-center'>
            <div className='md:w-1/2 px-4'>
              <h2 className='text-4xl font-bold mb-3'>
                Professional Chartered Accountant Services
              </h2>

              <p className='mb-3'>
                Expert tax filing, financial advice, and more
              </p>
              <a
                href={getBaseURL()}
                className='bg-white text-teal-600 py-2 px-4 rounded'
              >
                Get Started
              </a>
            </div>
            <div className='md:w-1/2 flex justify-center'>
              <img
                src={landingPageImg}
                alt='CA'
                className='w-[200px] rounded-lg shadow-md'
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </section>

        <section id='services' className='py-10'>
          <h3 className='text-3xl font-bold text-gray-800 mb-6'>
            Our Services
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Tax Filing
              </h4>
              <p className='text-gray-600'>
                We handle all aspects of tax filing for individuals and
                businesses.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Financial Planning
              </h4>
              <p className='text-gray-600'>
                Get expert financial advice to plan your future.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Audit Services
              </h4>
              <p className='text-gray-600'>
                Comprehensive audit services to ensure compliance and accuracy.
              </p>
            </div>
          </div>
        </section>

        <section id='about' className='py-10 px-6 bg-gray-200 rounded-lg'>
          <h3 className='text-3xl font-bold text-gray-800 mb-6'>About Us</h3>
          <p className='text-gray-600'>
            We are a team of professional Chartered Accountants dedicated to
            providing top-notch services to our clients. With years of
            experience, we ensure that your financial needs are met with the
            highest level of professionalism.
          </p>
        </section>
      </main>

      <footer className='bg-white shadow py-4'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-gray-600'>
            &copy; 2024 CA Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  ) : (
    <div className='bg-gray-100 min-h-screen'>
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <h1 className='text-sm md:text-2xl font-bold text-gray-800'>
            CA Services by :&nbsp;
            <span className='text-base md:text-2xl text-teal-600'>
              {adminData.name}
            </span>
          </h1>
          <nav>
            <a href='#services' className='hidden md:inline text-gray-800 mx-2'>
              Services
            </a>

            <a
              href={getBaseURL()}
              className='bg-teal-600 text-sm md:text-lg text-white py-2 px-4 rounded ml-4'
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      <main className='container mx-auto px-4 py-10'>
        <section
          id='hero'
          className='text-center py-10 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg mb-10 shadow-md'
        >
          <div className='flex flex-col gap-6 md:flex-row justify-evenly items-center'>
            <div className='md:w-1/2 px-4'>
              <h2 className='text-4xl font-bold mb-3'>
                Professional Chartered Accountant Services
              </h2>
              <p className='mb-2 flex justify-center'>
                <svg
                  className='w-6 h-6 text-gray-800 text-blue-900 dark:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1'
                  />
                </svg>
                : &nbsp;{adminData.email}
              </p>
              <p className='mb-4 flex justify-center'>
                <svg
                  className='w-6 h-6 text-gray-800 text-blue-900 dark:text-white'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z'
                  />
                </svg>
                : &nbsp;{adminData.phone}/&nbsp;{adminData.altPhone}
              </p>
              <p className='mb-3'>
                Expert tax filing, financial advice, and more
              </p>
              <a
                href={getBaseURL()}
                className='bg-white text-teal-600 py-2 px-4 rounded'
              >
                Get Started
              </a>
            </div>
            <div className='md:w-1/2 flex justify-center'>
              <img
                src={landingPageImg}
                alt='CA'
                className='w-[200px] rounded-lg shadow-md'
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </section>

        <section id='services' className='py-10'>
          <h3 className='text-3xl font-bold text-gray-800 mb-6'>
            Our Services
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Tax Filing
              </h4>
              <p className='text-gray-600'>
                We handle all aspects of tax filing for individuals and
                businesses.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Financial Planning
              </h4>
              <p className='text-gray-600'>
                Get expert financial advice to plan your future.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='text-xl font-bold text-gray-800 mb-2'>
                Audit Services
              </h4>
              <p className='text-gray-600'>
                Comprehensive audit services to ensure compliance and accuracy.
              </p>
            </div>
          </div>
        </section>

        <section id='about' className='py-10 px-6 bg-gray-200 rounded-lg'>
          <h3 className='text-3xl font-bold text-gray-800 mb-6'>About Us</h3>
          <p className='text-gray-600'>
            We are a team of professional Chartered Accountants dedicated to
            providing top-notch services to our clients. With years of
            experience, we ensure that your financial needs are met with the
            highest level of professionalism.
          </p>
        </section>
      </main>

      <footer className='bg-white shadow py-4'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-gray-600'>
            &copy; 2024 CA Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
