import React from 'react';
import { IbuttonProps } from '@/types/common/IbuttonProps';

const Button: React.FC<IbuttonProps> = ({ children, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
