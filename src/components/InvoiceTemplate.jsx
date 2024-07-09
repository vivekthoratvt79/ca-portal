import React from 'react';

const InvoiceTemplate = ({ billDetails }) => {
  console.log(billDetails);
  let { admin, bill, client, order, service } = billDetails;

  function getDate(createdDate) {
    const date = new Date(createdDate);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  function numberToWords(num) {
    const units = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
    ];
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    const hundred = 'Hundred';

    if (num === 0) return 'Zero';

    let words = '';

    function getBelowThousand(n) {
      let result = '';

      if (Math.floor(n / 100) > 0) {
        result += units[Math.floor(n / 100)] + ' ' + hundred;
        n %= 100;
      }

      if (n > 0) {
        if (result !== '') result += ' and ';

        if (n < 10) {
          result += units[n];
        } else if (n < 20) {
          result += teens[n - 10];
        } else {
          result += tens[Math.floor(n / 10)];
          if (n % 10 > 0) {
            result += '-' + units[n % 10];
          }
        }
      }

      return result;
    }

    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk > 0) {
        const chunkWords = getBelowThousand(chunk);
        words =
          chunkWords +
          (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') +
          (words ? ' ' + words : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim();
  }

  return (
    <div className='border-2 border-gray-300 p-4 rounded-md max-w-3xl mx-auto'>
      <div className='flex gap-4 justify-between'>
        <div>
          <div className='text-sm'>
            <p className='font-bold text-md'>{admin.name}</p>
            <p>{admin.address}</p>
            <p>{admin.phone}</p>
            <p>{admin.email}</p>
          </div>
        </div>
        <div className='text-sm text-end whitespace-nowrap'>
          <p>
            Invoice No.: <span className='font-bold'>{bill.invoiceNumber}</span>
          </p>
          <p>
            Date: <span className='font-bold'>{getDate(bill.createdDate)}</span>
          </p>
          <p>
            Due Date: <span className='font-bold'>{getDate(bill.dueDate)}</span>
          </p>
          <p>
            Currency: <span className='font-bold'>INR</span>
          </p>
        </div>
      </div>

      <div className='mt-4 border-t-2 border-gray-300 pt-2'>
        <p className='font-bold'>Invoiced To,</p>
        <p>{client.accountantName}</p>
        <p>{client.address}</p>
        <p>GSTIN - {client.gstNumber}</p>
        <p className='flex gap-2'>
          <svg
            className='w-6 h-6 text-gray-800 dark:text-white'
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

          {client.email}
        </p>
        <p className='flex gap-2'>
          <svg
            className='w-6 h-6 text-gray-800 dark:text-white'
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
          {client.phone}
        </p>
      </div>

      <div className='mt-4 border-t-2 border-gray-300 pt-2'>
        <div className='flex gap-4 justify-between text-sm'>
          <p>
            Tax is payable on reverse charge.(Yes/No):{' '}
            <span className='font-bold'>No</span>
          </p>
          <p className='text-end'>
            GSTIN: <span className='font-bold'>{admin.gstNumber}</span>
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
          {bill.billDetails.map(({ particular, amount, hsn, _id }, i) => (
            <tr className='border-b-2 border-gray-300' key={_id}>
              <td className='py-2'>{i + 1}</td>
              <td className='py-2'>{particular}</td>
              <td className='py-2'>{hsn}</td>
              <td className='py-2 text-right'>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='mt-4'>
        <div className='flex justify-between text-sm'>
          <p>Discount</p>
          <p>Rs. {bill.discount}</p>
        </div>
      </div>
      {!admin?.reverseCharge && (
        <div className='mt-4'>
          <div className='flex justify-between text-sm'>
            <p>CGST @ 9%(9.00%)</p>
            <p>{bill.taxAmount / 2}</p>
          </div>
          <div className='flex justify-between text-sm'>
            <p>SGST @ 9%(9.00%)</p>
            <p>{bill.taxAmount / 2}</p>
          </div>
        </div>
      )}

      <div className='mt-4 border-t-2 border-gray-300 pt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Total</p>
          <p className='font-bold'>Rs. {bill.finalAmount}</p>
        </div>
      </div>

      {/* <div className='mt-4 overflow-auto'>
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
      </div> */}

      <div className='mt-4 text-sm'>
        <p className='font-bold'>
          AMOUNT: {numberToWords(bill.finalAmount).toUpperCase()} RUPEES ONLY
        </p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
