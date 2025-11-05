import { USER_ROLE } from "@/@types/userRoleEnum";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import ReusableNavbar from "./naveBarr";

function UserNavbar() {
  return (
    <ReusableNavbar
      role={USER_ROLE.USER}
      homeUrl={UserUrls.home}
      dashboardUrl={UserUrls.dashboard}
      notificationsUrl={UserUrls.notifications}
      profileUrl={UserUrls.profile}
      subscriptionUrl={UserUrls.subscription}
      signInUrl={UserUrls.signIn}
      showCenterNavigation={true}
    />
  );
}

export default UserNavbar;