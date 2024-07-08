import React from 'react';

const ReceiptTemplate = ({ billDetails, receiptData }) => {
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
    <div className='max-w-md mx-auto bg-blue-100 p-6 rounded-md shadow-md mt-4'>
      <div className='text-center'>
        <h1 className='text-xl font-bold'>Adv. {admin.name}</h1>
        <p className='text-sm'>GST & INCOME TAX PRACTITIONER</p>
        <p className='text-sm'>{admin.address}</p>
        <p className='text-sm flex gap-2 items-center justify-center'>
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
          {admin.phone}
        </p>
      </div>
      <div className='flex justify-between mt-6'>
        <p>
          Bill No. : <span className='font-bold'>{receiptData.billNumber}</span>
        </p>
        <p>
          Date:{' '}
          <span className='font-bold'>
            {getDate(receiptData.receiptDetails[0].dateOfPayment)}
          </span>
        </p>
      </div>
      <div className='mt-4'>
        <p>
          Received with thanks from M/s./Shri.{' '}
          <span className='font-bold'>{client.name.toUpperCase()}</span>
        </p>
        <p>
          a sum of Rupees{' '}
          <span className='font-bold'>
            {numberToWords(receiptData.receivedAmount).toUpperCase()} ONLY
          </span>
        </p>

        <p>
          in payment against the bill No.{' '}
          <span className='font-bold'>{receiptData.invoiceNumber}</span>
          <span className='font-bold'>NEFT</span>
        </p>
      </div>
      <div className='flex justify-between mt-6'>
        <p>
          Rs. <span className='font-bold'>{receiptData.receivedAmount}</span>
        </p>
        <p className='text-right'>For Adv. {admin.name}</p>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
