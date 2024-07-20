import React from 'react';

const ReceiptTemplate = ({ billDetails, receiptData }) => {
  let { admin, bill, client, order, service } = billDetails;

  console.log('billDetails', billDetails);
  console.log('receiptData', receiptData);
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
    <div className='max-w-md mx-auto bg-blue-100 p-2 rounded-md shadow-md mt-4'>
      <div className='flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-4'>
        <div>
          <p className='font-bold'>CA. {admin.name}</p>
          <p className='text-xs'>GST & INCOME TAX PRACTITIONER</p>
          <p className='text-xs'>{admin.address}</p>
        </div>
        <div className='text-right'>
          <h1 className='text-md font-bold'>Receipt No.</h1>
          <input
            type='text'
            className='border-b-2 border-dotted w-[110px] focus:outline-none text-right'
            value={receiptData.billNumber}
            disabled
            readOnly
          />
        </div>
      </div>
      <div className='flex justify-between mb-4'>
        <div className='w-1/2'>
          <p>From</p>
          <input
            type='text'
            className='w-full border-b-2 p-2 border-dotted focus:outline-none'
            value={client.name.toUpperCase()}
            readOnly
          />
        </div>
        <div className='w-1/2'>
          <p>Date</p>
          <input
            type='text'
            className='w-full border-b-2 p-2 border-dotted focus:outline-none'
            value={getDate(receiptData.receiptDetails[0].dateOfPayment)}
            readOnly
          />
        </div>
      </div>
      <div className='mb-4'>
        <p>Amount</p>
        <input
          type='text'
          className='w-full p-2 border-b-2 border-dotted focus:outline-none'
          value={`${receiptData.receivedAmount} /-`}
          readOnly
        />
      </div>
      <div className='mb-4'>
        <p>In word</p>
        <input
          type='text'
          className='w-full border-b-2 p-2 border-dotted focus:outline-none'
          value={`${numberToWords(
            receiptData.receivedAmount
          ).toUpperCase()} ONLY`}
          readOnly
        />
      </div>
      <div className='mb-4'>
        <p>In payment against the invoice number,</p>
        <input
          type='text'
          className='w-full border-b-2 border-dotted p-2 focus:outline-none'
          value={receiptData.invoiceNumber}
          readOnly
        />
      </div>
      <div className='flex justify-between mb-4'>
        <div className='w-1/3'>
          <p>ACCT.</p>
          <input
            type='text'
            className='w-full border-b-2 p-2 border-dotted focus:outline-none'
            value={receiptData.finalAmount}
            readOnly
          />
        </div>
        <div className='w-1/3'>
          <p>PAID</p>
          <input
            type='text'
            className='w-full border-b-2 p-2 border-dotted focus:outline-none'
            value={receiptData.receivedAmount}
            readOnly
          />
        </div>
        <div className='w-1/3'>
          <p>DUE</p>
          <input
            type='text'
            className='w-full border-b-2 p-2 border-dotted focus:outline-none'
            value={receiptData.pendingAmount}
            readOnly
          />
        </div>
      </div>

      <div className='flex justify-between items-center mt-4 border-t-2 border-gray-300 pt-2'>
        <div className='text-left text-sm w-1/2'>
          <p>{admin.email}</p>
          <p>+91 {admin.phone}</p>
          <p>{admin.address}</p>
        </div>
        <div className='text-right'>
          <p className='border-b-2 font-bold text-sm border-dotted p-2 focus:outline-none'>
            For : <br></br>CA. {admin.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
