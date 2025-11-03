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
  const higeNavbar = routeWithoutNav.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!higeNavbar && <MentorNavbar />}
      <div className={higeNavbar ? "" : "pt-16"}>
        <Outlet />
      </div>
      {!higeNavbar && <MentorFooter />}
    </>
  );
}

export default MentorLayout;
