import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const Home = ({ access }) => {
  return (
    <>
      <Sidebar activeTab='dashboard' access={access} />

      <div className='p-4 sm:ml-64 h-91vh'>
        <Dashboard />
      </div>
    </>
  );
};

export default Home;
