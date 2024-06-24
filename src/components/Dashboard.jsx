import React from 'react';
import PieChart from './PieChart';

const Dashboard = () => {
  const storageData = [40, 60]; // Used, Available
  const msgData = [37, 100]; // Used, Available
  const emailData = [20, 100]; // Used, Available
  const whatsappData = [80, 100]; // Used, Available
  return (
    <>
      <div
        className='items-center flex justify-between font-semibold h-16 p-4 border-2 border-dashed rounded-lg dark:border-gray-700'
        style={{ borderColor: '#41506b' }}
      >
        Dashboard
      </div>
      <div className='flex justify-center'>
        <div
          className='flex justify-around flex-wrap p-4'
          style={{ rowGap: '20px', maxWidth: '700px', columnGap: '100px' }}
        >
          <PieChart data={storageData} title='Storage Usage' />
          <PieChart data={msgData} title='Message Usage' />
          <PieChart data={emailData} title='Email Usage' />
          <PieChart data={whatsappData} title='Whatsapp Usage' />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
