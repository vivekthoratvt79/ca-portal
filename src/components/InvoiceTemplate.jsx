import React from 'react';

const InvoiceTemplate = () => {
  return (
    <div className='border-2 border-gray-300 p-4 rounded-md max-w-3xl mx-auto'>
      <div className='flex justify-between'>
        <div>
          <div className='text-sm'>
            <p className='font-bold text-md'>ABC Ltd.</p>
            <p>Shivranjini Shyamal Road, Satellite, AHMEDABAD 380015</p>
            <p>9985567355, (079) 40056523</p>
            <p>abc@abc.com</p>
          </div>
        </div>
        <div className='text-sm'>
          <p>
            Invoice No.: <span className='font-bold'>aipi00013</span>
          </p>
          <p>
            Date: <span className='font-bold'>27-Jun-2019</span>
          </p>
          <p>
            Due Date: <span className='font-bold'>05-Jul-2019</span>
          </p>
          <p>
            Currency: <span className='font-bold'>INR</span>
          </p>
        </div>
      </div>

      <div className='mt-4 border-t-2 border-gray-300 pt-2'>
        <p className='font-bold'>Invoiced To,</p>
        <p>Adani Enterprise</p>
        <p>
          12-B, Radhe Society, Nr. Ankur Cross Road, Ankur, AHMEDABAD 380048
        </p>
        <p>GUJARAT (State Code - 24)</p>
        <p>Mo.1234567895</p>
      </div>

      <div className='mt-4 border-t-2 border-gray-300 pt-2'>
        <div className='flex justify-between text-sm'>
          <p>
            Tax is payable on reverse charge.(Yes/No):{' '}
            <span className='font-bold'>No</span>
          </p>
          <p>
            GSTIN: <span className='font-bold'>ASD12355MNGP</span>
          </p>
        </div>
      </div>

      <table className='w-full mt-4 border-collapse'>
        <thead>
          <tr className='border-b-2 border-gray-300'>
            <th className='text-left py-2'>Sr.</th>
            <th className='text-left py-2'>Particulars</th>
            <th className='text-left py-2'>HSN/SAC</th>
            <th className='text-right py-2'>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-b-2 border-gray-300'>
            <td className='py-2'>1</td>
            <td className='py-2'>INTERNAL AUDIT - Yearly - 2018-2019</td>
            <td className='py-2'>123455</td>
            <td className='py-2 text-right'>5,500.00</td>
          </tr>
          <tr className='border-b-2 border-gray-300'>
            <td className='py-2'>2</td>
            <td className='py-2'>
              BUSINESS MENTORING SERVICES - First Half (Apr - Sep) - 2019-2020
            </td>
            <td className='py-2'>123455</td>
            <td className='py-2 text-right'>3,500.00</td>
          </tr>
        </tbody>
      </table>

      <div className='mt-4'>
        <div className='flex justify-between text-sm'>
          <p>CGST @ 9%(9.00%)</p>
          <p>810.00</p>
        </div>
        <div className='flex justify-between text-sm'>
          <p>SGST @ 9%(9.00%)</p>
          <p>810.00</p>
        </div>
      </div>

      <div className='mt-4 border-t-2 border-gray-300 pt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Total</p>
          <p className='font-bold'>INR 10,620.00</p>
        </div>
      </div>

      <div className='mt-4 overflow-auto'>
        <table className='w-full border-collapse text-sm'>
          <thead>
            <tr className='border-b-2 border-gray-300'>
              <th className='text-left p-2'>HSN/SAC</th>
              <th className='text-left p-2'>Taxable Value</th>
              <th className='text-left p-2'>Rate</th>
              <th className='text-left p-2'>SGST @ 9%</th>
              <th className='text-left p-2'>Rate</th>
              <th className='text-left p-2'>CGST @ 9%</th>
              <th className='text-left p-2'>Total Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b-2 border-gray-300'>
              <td className='py-2'>123455</td>
              <td className='py-2'>9000.00</td>
              <td className='py-2'>9.00%</td>
              <td className='py-2'>810.00</td>
              <td className='py-2'>9.00%</td>
              <td className='py-2'>810.00</td>
              <td className='py-2'>1,620.00</td>
            </tr>
            <tr className='border-b-2 border-gray-300'>
              <td className='py-2'>Total</td>
              <td className='py-2'>9000.00</td>
              <td className='py-2'></td>
              <td className='py-2'>810.00</td>
              <td className='py-2'></td>
              <td className='py-2'>810.00</td>
              <td className='py-2'>1,620.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='mt-4 text-sm'>
        <p className='font-bold'>TAX: ONE THOUSAND SIX HUNDRED TWENTY ONLY</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
