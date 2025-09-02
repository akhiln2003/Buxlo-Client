import React from 'react'

export interface IInputFieldProps{
    value: string | number;
    label?:string; 
    name: string; 
    placeholder?: string;
    type: string; 
    onChange: React.ChangeEventHandler<HTMLInputElement>
}