import React, { useEffect, useRef, useState } from 'react';
import landingPageImg from '../Images/landingPage.png';
import CAImg from '../Images/ca-wallpaper.jpeg';
import AccuracyImg from '../Images/accuracy.png';
import EfficientImg from '../Images/efficient.jpg';
import MeetingImg from '../Images/meeting.png';
import * as api from '../api';

function LandingPage({ subdomain }) {
  const [adminData, setAdminData] = useState({});
  const servicesRef = useRef(null);
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

  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Header = ({ admin }) => {
    return (
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          {admin ? (
            <h1 className='text-sm md:text-2xl font-bold text-gray-800'>
              CA Services by :&nbsp;
              <span className='text-base md:text-2xl text-teal-600'>
                {adminData.name}
              </span>
            </h1>
          ) : (
            <h1 className='text-sm md:text-2xl font-bold text-gray-800'>
              CA Services
            </h1>
          )}

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
    );
  };
  const Hero = ({ admin }) => {
    return (
      <div
        className='relative bg-cover bg-center h-screen flex items-center justify-center'
        style={{
          backgroundImage: `url(${CAImg})`,
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='relative z-10 text-center text-white'>
          <h1 className='text-5xl font-bold mb-4 animate-fadeInUp'>
            Professional Chartered Accountant Services
          </h1>
          <p className={`${admin ? 'mb-4' : 'mb-8'} text-xl animate-fadeInUp`}>
            Expert tax filing, financial advice, and more
          </p>
          {admin && (
            <>
              <p className='mb-2 flex text-lg font-bold justify-center animate-fadeInUp'>
                CA. {adminData.name}
              </p>
              <p className='mb-2 flex font-bold  justify-center animate-fadeInUp'>
                <svg
                  className='w-6 h-6 dark:text-white'
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
              <p className='mb-4 flex font-bold  justify-center animate-fadeInUp'>
                <svg
                  className='w-6 h-6 dark:text-white'
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
              <p className='mb-3 animate-fadeInDown'>
                Expert tax filing, financial advice, and more
              </p>
            </>
          )}
          <button
            onClick={(e) => window.location.replace(getBaseURL())}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded animate-bounce'
          >
            Learn More
          </button>
        </div>
      </div>
    );
  };

  const About = () => {
    return (
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h2 className='text-4xl font-bold mb-4'>
              Verified professional helping you with 100% compliance
            </h2>
            <p className='mb-4'>
              <b>Accuracy Delivered</b>
              <br></br>
              We use ISO 27001 certified data centers, which are quarterly VAPT
              tested and externally audited.
            </p>
            <p className='mb-4'>
              <b>Data Security</b>
              <br></br>
              Data security is our priority We do not share our or your clients’
              data with unaffiliated third parties for their own purposes.
            </p>
            <p className='mb-4'>
              <b>3x faster experience</b> <br></br>Save 2 man-days per GSTIN
              every month
            </p>
            <p className='mb-4'>
              <b>Efficiency</b>
              <br></br>Maximise efficiency with PAN-level filings
            </p>
            <p className='mb-4'>
              <b>Upto 7% tax savings</b> <br></br>Claim 100% ITC and save an
              average of 4% GST everytime.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <img
              src={EfficientImg}
              alt='Attorney'
              className='w-full h-auto object-cover'
            />
            <img
              src={AccuracyImg}
              alt='Meeting'
              className='w-full h-auto object-cover'
            />
            <img
              src={MeetingImg}
              alt='Discussion'
              className='w-full h-auto object-cover col-span-2'
            />
          </div>
        </div>
      </div>
    );
  };

  const services = [
    {
      title: 'Income Tax Filing',
      description:
        'We handle all aspects of tax filing for individuals and businesses.',
      icon: '🏛️', // Replace with actual icon
    },
    {
      title: 'GST Filing',
      description: 'GST - R1, R9, 3B, 2B, 2B vs PR solution',
      icon: '📄', // Replace with actual icon
    },
    {
      title: 'TDS',
      description: 'e-TDS return filing solution',
      icon: '📝', // Replace with actual icon
    },
  ];

  const Services = () => {
    return (
      <div
        className='container mx-auto px-4 py-16'
        id='services'
        ref={servicesRef}
      >
        <h2 className='text-4xl font-bold text-center mb-8'>
          Services We Provide
        </h2>
        <p className='text-center mb-12'>
          We are a team of professional Chartered Accountants dedicated to
          providing top-notch services to our clients. With years of experience,
          we ensure that your financial needs are met with the highest level of
          professionalism.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              className='bg-blue-900 text-white p-8 rounded-lg shadow-lg text-center'
            >
              <div className='text-6xl mb-4'>{service.icon}</div>
              <h3 className='text-2xl font-bold mb-2'>{service.title}</h3>
              <p className='mb-4'>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Footer = () => {
    return (
      <footer className='bg-white shadow py-4'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-gray-600'>
            &copy; 2024 CA Services. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };

  return !Object.keys(adminData).length ? (
    <div className='bg-gray-100 min-h-screen'>
      <Header />
      <Hero />
      <About />
      <Services />
      <Footer />
    </div>
  ) : (
    <div className='bg-gray-100 min-h-screen'>
      <Header admin={true} />
      <Hero admin={true} />
      <About />
      <Services />
      <Footer />
    </div>
  );
}

export default LandingPage;
