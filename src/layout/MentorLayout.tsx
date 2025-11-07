import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
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
     UserUrls.chat
  ];
  const higeNavbar = routeWithoutNav.some((route) =>
    pathname.startsWith(route)
  );
   const higeFooter = routeWithoutFooter.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!higeNavbar && <MentorNavbar />}
      <div className={higeNavbar ? "" : "pt-16"}>
        <Outlet />
      </div>
      {!higeFooter && <MentorFooter />}
    </>
  );
}

export default MentorLayout;
