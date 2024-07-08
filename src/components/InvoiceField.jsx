import React from 'react';

const InvoiceField = ({ onEditItem, cellData }) => {
  return (
    <input
      className={`${cellData.className} p-2 invoice-input`}
      type={cellData.type}
      placeholder={cellData.placeholder}
      min={cellData.min}
      max={cellData.max}
      step={cellData.step}
      name={cellData.name}
      id={cellData.id}
      value={cellData.value}
      onChange={onEditItem}
      required
    />
  );
};

export default InvoiceField;
