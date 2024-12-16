import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import { useGetUser } from "@/hooks/useGetUser"
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface MentorProtectedProps {
    children?: React.ReactNode;
  }
const AdminProtected: React.FC<MentorProtectedProps>  = ({children}) =>{
    const user = useGetUser();
    if(!user){
        
        return <Navigate to={AdminUrls.signIn}/>
    }
    return children ? <>{children}</> : < Outlet />
}


export default AdminProtected;

