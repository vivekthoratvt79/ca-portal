import React, { useEffect, useRef, useState } from 'react';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import incrementString from '../helpers/incrementString';
import * as api from '../api';
import Loader from './Loader';

const date = new Date();
const today = date.toLocaleDateString('en-GB', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

const InvoiceForm = ({
  showModal,
  closeModal,
  invoiceData,
  adminData,
  setRefresh,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('18');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [items, setItems] = useState([]);
  console.log('invoiceData', invoiceData);
  useEffect(() => {
    setItems([]);
    setInvoiceNumber(invoiceData.invoiceNumber);
    invoiceData?.billDetails?.forEach(({ particular, amount, hsn }, index) => {
      setItems((prevItems) => [
        ...prevItems,
        {
          _id: index,
          particular,
          hsn,
          amount,
        },
      ]);
    });
  }, [invoiceData]);

  const modalRef = useRef(null);
  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addItemHandler = () => {
    const _id = Date.now() + Math.random();
    setItems((prevItems) => [
      ...prevItems,
      {
        _id,
        particular: '',
        hsn: '',
        amount: 0,
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const edtiItemHandler = (id, name, value) => {
    const updatedItems = items.map((item) => {
      if (item._id == id) {
        console.log(typeof id);
        item._id =
          typeof id == 'number'
            ? id.toString().replace(/\./g, '')
            : id.replace(/\./g, '');
        let val =
          name == 'amount' ? { [name]: parseInt(value) } : { [name]: value };
        return { ...item, ...val };
      } else {
        return item;
      }
    });
    setItems(updatedItems);
  };

  const subtotal = items.reduce((prev, curr) => {
    if (curr.particular.trim().length > 0) return prev + Number(curr.amount);
    else return prev;
  }, 0);
  const discountRate = parseInt(discount) || 0;
  const taxRate = adminData?.reverseCharge
    ? 0
    : (tax * (subtotal - discountRate)) / 100;
  const total = adminData?.reverseCharge
    ? subtotal - discountRate
    : subtotal + taxRate - discountRate;

  if (!showModal) return null;

  const handleSave = (e) => {
    setLoading(true);
    let payload = {};
    payload.billRef = invoiceData._id;
    payload.discount = discountRate;
    payload.billDetails = items;
    payload.taxAmount = taxRate;
    api
      .updateBillToPendingStage(payload)
      .then(({ data }) => {
        setLoading(false);
        if (data.statusCode == 200) {
          setSuccessMsg('Sent to Client');
        } else {
          setErrorMsg('Failed... Try Later');
        }
        setTimeout(() => {
          setLoading(false);
          setSuccessMsg('');
          setErrorMsg('');
          closeModal();
          setRefresh(Date.now() + Math.random());
        }, 4000);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg('Failed... Try Later');
        setTimeout(() => {
          setLoading(false);
          setSuccessMsg('');
          setErrorMsg('');
          closeModal();
          setRefresh(Date.now() + Math.random());
        }, 4000);
      });
  };

  return (
    <div
      className={`fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50`}
    >
      <div
        ref={modalRef}
        className={`mx-auto p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-md my-8 inline-block w-[1000px] transform overflow-auto rounded-lg bg-white text-left align-middle shadow-xl transition-all ${
          smallScreen ? 'mobile-modal' : 'h-[500px] overflow-auto'
        }`}
      >
        <form
          className='relative flex flex-col px-2 md:flex-row'
          onSubmit={reviewInvoiceHandler}
        >
          <div className='my-4 flex-1 space-y-2 rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p-6'>
            <div className='flex flex-col justify-between space-y-2 border-b border-gray-900/10 pb-4 md:flex-row md:items-center md:space-y-0'>
              <div className='flex space-x-2'>
                <span className='font-bold'>Current Date: </span>
                <span>{today}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <label
                  className='font-bold whitespace-nowrap'
                  htmlFor='invoiceNumber'
                >
                  Invoice Number:
                </label>
                <input
                  required
                  className='max-w-[130px]'
                  type='text'
                  name='invoiceNumber'
                  id='invoiceNumber'
                  disabled
                  value={invoiceNumber}
                />
              </div>
            </div>
            <h1 className='text-center text-lg font-bold'>INVOICE</h1>

            <table className='w-full p-4 text-left'>
              <thead>
                <tr className='border-b border-gray-900/10 text-sm md:text-base'>
                  <th>Service</th>
                  <th>HSN</th>
                  <th className='text-center'>AMOUNT</th>
                  <th className='text-center'>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <InvoiceItem
                    key={item._id}
                    _id={item._id}
                    particular={item.particular}
                    hsn={item.hsn}
                    amount={item.amount}
                    onDeleteItem={deleteItemHandler}
                    onEdtiItem={edtiItemHandler}
                  />
                ))}
              </tbody>
            </table>
            <button
              className='rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-600'
              type='button'
              onClick={addItemHandler}
            >
              Add Item
            </button>
          </div>
          <div className='basis-1/4 bg-transparent'>
            <div className='sticky top-0 z-10 space-y-4 divide-y divide-gray-900/10 pb-8 md:pt-6 md:pl-4'>
              <InvoiceModal isOpen={isOpen} setIsOpen={setIsOpen} />
              <div className='space-y-4 py-2'>
                <div className='space-y-2'>
                  <label
                    className='text-sm font-bold md:text-base'
                    htmlFor='discount'
                  >
                    Discount rate:
                  </label>
                  <div className='flex items-center'>
                    <input
                      className='w-full p-2 rounded-r-none bg-white shadow-sm'
                      type='number'
                      name='discount'
                      id='discount'
                      min='0'
                      step='0.01'
                      placeholder='0.0'
                      value={discount}
                      onChange={(event) => setDiscount(event.target.value)}
                    />
                  </div>
                </div>
                {!adminData?.reverseCharge ? (
                  <div className='space-y-2'>
                    <label
                      className='text-sm font-bold md:text-base'
                      htmlFor='tax'
                    >
                      Tax rate:
                    </label>
                    <div className='flex items-center'>
                      <input
                        className='w-full p-2 rounded-r-none bg-white shadow-sm'
                        type='number'
                        name='tax'
                        id='tax'
                        min='0.01'
                        step='0.01'
                        placeholder='0.0'
                        value={tax}
                        disabled
                        onChange={(event) => setTax(event.target.value)}
                      />
                      <span className='rounded-r-md bg-gray-200 py-2 px-4 text-gray-500 shadow-sm'>
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <div className='flex items-center text-sm font-bold'>
                      Tax is payable on reverse charge: Yes
                    </div>
                  </div>
                )}

                <div className='flex flex-col space-y-2 pt-6'>
                  <div className='flex w-full justify-between'>
                    <span className='font-bold'>Subtotal:</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex w-full justify-between'>
                    <span className='font-bold'>Discount:</span>
                    <span>Rs. {discountRate.toFixed(2)}</span>
                  </div>
                  {!adminData?.reverseCharge && (
                    <div className='flex w-full justify-between'>
                      <span className='font-bold'>Tax:</span>
                      <span>
                        ({tax || '0'}%) Rs. {taxRate.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className='flex w-full justify-between border-t border-gray-900/10 pt-2'>
                    <span className='font-bold'>Total:</span>
                    <span className='font-bold'>
                      Rs. {total % 1 === 0 ? total : total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className='flex gap-4 justify-between'>
                  {loading ? (
                    <button
                      className='w-full space-y-4 rounded-md bg-grey-500 py-2 text-sm text-white shadow-sm hover:bg-grey-600'
                      type='button'
                      onClick={(e) => handleSave(e)}
                    >
                      <Loader />
                    </button>
                  ) : successMsg ? (
                    <button
                      className='w-full space-y-4 rounded-md bg-green-500 py-2 text-sm text-white shadow-sm hover:bg-green-600'
                      type='button'
                      onClick={(e) => handleSave(e)}
                    >
                      {successMsg}
                    </button>
                  ) : errorMsg ? (
                    <button
                      className='w-full space-y-4 rounded-md bg-red-500 py-2 text-sm text-white shadow-sm hover:bg-red-600'
                      type='button'
                      onClick={(e) => handleSave(e)}
                    >
                      {errorMsg}
                    </button>
                  ) : (
                    <button
                      className='w-full space-y-4 rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600'
                      type='button'
                      onClick={(e) => handleSave(e)}
                    >
                      Save & Send to Client
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
