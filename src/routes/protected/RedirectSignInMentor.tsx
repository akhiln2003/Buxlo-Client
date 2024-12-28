import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { useGetUser } from "@/hooks/useGetUser";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface UserProtectedProps {
  children?: React.ReactNode;
}

const RedirectSignInMentor: React.FC<UserProtectedProps> = ({ children }) => {
  const user = useGetUser();

  // If the user is logged in, stick to the current URL
  if (user?.role == USER_ROLE.MENTOR ) {
    return < Navigate to={MentorUrl.home} />
    
  }

  // If the user is not logged in
  return children ? <>{children}</> : <Outlet />;
};

export default RedirectSignInMentor;
