import { USER_ROLE } from "@/@types/userRoleEnum";
import ReusableNavbar from "./naveBarr";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";

function MentorNavbar() {
  return (
    <ReusableNavbar
      role={USER_ROLE.MENTOR}
      homeUrl={MentorUrl.home}
      dashboardUrl={MentorUrl.dashboard}
      notificationsUrl={MentorUrl.notifications}
      profileUrl={MentorUrl.profile}
      subscriptionUrl={MentorUrl.subscription}
      signInUrl={MentorUrl.signIn}
      showCenterNavigation={true}
      showSubscription={true}
    />
  );
}

export default MentorNavbar;