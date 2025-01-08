import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useGetUser } from "@/hooks/useGetUser"
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface UserProtectedProps {
    children?: React.ReactNode;
  }
const UserProtected: React.FC<UserProtectedProps>  = ({children}) =>{
    const user = useGetUser();
    if(!user){
        
        return <Navigate to={UserUrls.signIn}/>
    }
    return children ? <>{children}</> : < Outlet />
}


export default UserProtected;