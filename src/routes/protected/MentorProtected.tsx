import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { useGetUser } from "@/hooks/useGetUser";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface MentorProtectedProps {
  children?: React.ReactNode;
}
const MentorProtected: React.FC<MentorProtectedProps> = ({ children }) => {
  const user = useGetUser();
  if (!user) {
    return <Navigate to={MentorUrl.signIn} />;
  }
    // If the user is logged in, stick to the current URL
    if (user?.role !== USER_ROLE.MENTOR ) {
      return < Navigate to={MentorUrl.signIn} />
      
    }
  return children ? <>{children}</> : <Outlet />;
};

export default MentorProtected;
