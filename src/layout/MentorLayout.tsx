import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import MentorFooter from "@/components/footer/MentorFooter";
import MentorNavbar from "@/components/navbar/MentorNavvar";
import { Outlet, useLocation } from "react-router-dom";

function MentorLayout() {
  const { pathname } = useLocation();

  const routeWithoutNav = [
    MentorUrl.signIn,
    MentorUrl.signUp,
    MentorUrl.otp,
    MentorUrl.forgotPassword,
    "/mentor/resetpassword",
  ];

  const routeWithoutFooter = [
    MentorUrl.signIn,
    MentorUrl.signUp,
    MentorUrl.otp,
    MentorUrl.forgotPassword,
    "/mentor/resetpassword",
    "/mentor/chat", // ✅ Hide footer on chat page
  ];

  const hideNavbar = routeWithoutNav.some((route) =>
    pathname.startsWith(route)
  );
  const hideFooter = routeWithoutFooter.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!hideNavbar && <MentorNavbar />}
      <div className={hideNavbar ? "" : "pt-16"}>
        <Outlet />
      </div>
      {!hideFooter && <MentorFooter />}
    </>
  );
}

export default MentorLayout;
