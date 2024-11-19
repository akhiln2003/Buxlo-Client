import {  ReactNode } from "react";


export interface IbuttonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string; 
}