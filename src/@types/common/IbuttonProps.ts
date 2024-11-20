import {  ReactNode } from "react";


export interface IbuttonProps {
  text: string;
  onClick?: () => void;
  className?: string; 
}