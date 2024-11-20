import React from 'react';
import { IbuttonProps } from '@/@types/common/IbuttonProps';

const Button: React.FC<IbuttonProps> = ({ text, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
