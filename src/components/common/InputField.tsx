import { IinputFieldProps } from '@/@types/common/IinputFieldProps'
import React from 'react'

const InputField: React.FC<IinputFieldProps> = ({ value, label, name, placeholder, type, onChange }) => {
  return (
    <div>
        { label && <label htmlFor={name}>{label}</label> }
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder || ""}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
