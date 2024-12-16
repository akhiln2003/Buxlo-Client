import { useGetUser } from "@/hooks/useGetUser"
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface MentorProtectedProps {
    children?: React.ReactNode;
  }
const MentorProtected: React.FC<MentorProtectedProps>  = ({children}) =>{
    const user = useGetUser();
    if(!user){
        
        return <Navigate to={'/'}/>
    }
    return children ? <>{children}</> : < Outlet />
}


export default MentorProtected;

