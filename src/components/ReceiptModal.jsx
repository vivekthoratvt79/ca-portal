import React, { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ReceiptTemplate from './ReceiptTemplate';
import * as api from '../api';
import Loader from './Loader';

const ReceiptModal = ({ showModal, closeModal, receiptData, adminData }) => {
  if (!showModal) return null;
  console.log(receiptData);
  const [billDetails, setBillDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const windowWidth = window.innerWidth;
  const smallScreen = windowWidth <= 768;

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('printR');

    if (!dom) {
      console.error('Element with id "print" not found!');
      return;
    }
    const fixedWidth = 550; // Set a fixed width for the image capture
    dom.style.width = `${fixedWidth}px`;

    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF with padding settings.
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [5.5, 8.5],
          });

          const padding = 0.1; // 0.1 inches padding
          const additionalTopPadding = 0.5; // Additional padding for the top of subsequent pages

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
          const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * padding;

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor(
            (imgProps.width * pdfHeight) / pdfWidth
          );
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight() - 2 * padding;

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = 'white';
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            const topPadding =
              page === 0 ? padding : padding + additionalTopPadding;
            pdf.addImage(
              imgData,
              imageType,
              padding,
              topPadding,
              pdfWidth,
              pageHeight - (page === 0 ? 0 : additionalTopPadding)
            );
          }
          // Output / Save
          pdf.save(`receipt-${receiptData.billNumber}.pdf`);
        };
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      })
      .finally(() => {
        // Restore the original width after generating the PDF
        dom.style.width = '';
      });
  };

  useEffect(() => {
    function fetchBillDetails() {
      setLoading(true);
      api.getBillDetails(receiptData._id).then(({ data }) => {
        if (data.statusCode === 200) {
          console.log('data', data);
          setBillDetails(data.data);
        } else {
          setBillDetails({});
        }
        setLoading(false);
      });
    }
    if (Object.keys(receiptData).length) fetchBillDetails();
  }, [receiptData]);

  return (
    <div className='fixed z-40 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'>
      <div className='fixed inset-0 z-30' onClick={closeModal} />
      <div
        className={`relative z-40 mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md my-8 inline-block w-full max-w-xl transform overflow-auto text-left align-middle shadow-xl transition-all ${
          smallScreen ? 'mobile-modal' : 'h-[600px] overflow-auto'
        }`}
      >
        {loading ? (
          <Loader />
        ) : !Object.keys(billDetails).length ? (
          <div className='p-4' id='print'>
            <h1 className='text-center text-lg mb-2 font-bold text-gray-900'>
              RECEIPT
            </h1>
            <p className='text-center text-sm mt-4 text-red-500 font-bold text-gray-900'>
              Failed to fetch receipt data!
            </p>
          </div>
        ) : (
          <>
            <div className='p-4' id='printR'>
              <h1 className='text-center text-lg mb-2 font-bold text-gray-900'>
                RECEIPT
              </h1>
              <ReceiptTemplate
                billDetails={billDetails}
                receiptData={receiptData}
              />
            </div>
            <div className='mt-2 flex space-x-2 px-4 pb-6'>
              <button
                className='flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white'
                onClick={SaveAsPDFHandler}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                  />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptModal;
