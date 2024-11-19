import React from 'react'

export interface IinputFieldProps{
    value: string | number;
    label?:string; 
    name: string; 
    placeholder?: string;
    type: string; 
    onChange: React.ChangeEventHandler<HTMLInputElement>
}