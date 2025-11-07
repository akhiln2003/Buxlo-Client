import { Outlet, useLocation } from "react-router-dom";
import UserNavbar from "@/components/navbar/UserNavbar";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import UserFooter from "@/components/footer/UserFooter";

function UserLayout() {
  const { pathname } = useLocation();

  const routeWithoutNav = [
    UserUrls.signIn,
    UserUrls.signUp,
    UserUrls.otp,
    UserUrls.forgotPassword,
    "/resetpassword",
    UserUrls.videoCall,
  ];

  const routeWithoutFooter = [
    UserUrls.signIn,
    UserUrls.signUp,
    UserUrls.otp,
    UserUrls.forgotPassword,
    "/resetpassword",
    UserUrls.videoCall,
    UserUrls.call,
    UserUrls.chat,
  ];

  const hideNavbar = routeWithoutNav.some((route) =>
    pathname.startsWith(route)
  );
  const hideFooter = routeWithoutFooter.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!hideNavbar && <UserNavbar />}
      <div className={hideNavbar ? "" : "pt-16"}>
        <Outlet />
      </div>
      {!hideFooter && <UserFooter />}
    </>
  );
}

export default UserLayout;
