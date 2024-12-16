import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import { useGetUser } from "@/hooks/useGetUser";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface UserProtectedProps {
  children?: React.ReactNode;
}

const RedirectSignInAdmin: React.FC<UserProtectedProps> = ({ children }) => {
  const user = useGetUser();

  // If the user is logged in, stick to the current URL
  if (user) {
    return < Navigate to={AdminUrls.dashbord} />
    
  }

  // If the user is not logged in
  return children ? <>{children}</> : <Outlet />;
};

export default RedirectSignInAdmin;
