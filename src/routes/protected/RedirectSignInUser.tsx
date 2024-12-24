import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { useGetUser } from "@/hooks/useGetUser";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface UserProtectedProps {
  children?: React.ReactNode;
}

const RedirectSignInUser: React.FC<UserProtectedProps> = ({ children }) => {
  const user = useGetUser();

  // If the user is logged in, stick to the current URL
  if (user?.role == USER_ROLE.USER) {
    return < Navigate to={UserUrls.home} />
    
  }

  // If the user is not logged in
  return children ? <>{children}</> : <Outlet />;
};

export default RedirectSignInUser;
