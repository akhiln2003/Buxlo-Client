
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { USER_ROLE } from "@/@types/userRoleEnum";
import qrCodeImage from "@/assets/images/dummyQrCode.webp";
import ReusableFooter from "./ReusableFooterComponent";

function UserFooter() {
  const userSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", url: UserUrls.home },
        { name: "Dashboard", url: UserUrls.dashboard },
        { name: "Find Mentors", url: UserUrls.listMentors },
        { name: "My Bookings", url: UserUrls.listBookings },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "Contact Us", url: UserUrls.contact },
        { name: "Support Community", url: "#" },
      ],
    },
    {
      title: "Policies",
      links: [
        { name: "Terms & Conditions", url: "#" },
        { name: "Privacy Policy", url: "#" },
      ],
    },
  ];

  return (
    <ReusableFooter
      sections={userSections}
      contactEmail="support@buxlo.com"
      contactPhone="+91 XXXXXXXXXX"
      contactAddress="123 Financial Street, Mumbai, India"
      socialLinks={{
        facebook: "https://facebook.com/buxlo",
        twitter: "https://twitter.com/buxlo",
        linkedin: "https://linkedin.com/company/buxlo",
        instagram: "https://instagram.com/buxlo",
      }}
      qrCodeImage={qrCodeImage}
      qrCodeLabel="Scan the QR code to download the app"
      userSignInUrl={UserUrls.signIn}
      mentorSignInUrl={MentorUrl.signIn}
      role={USER_ROLE.USER}
    />
  );
}

export default UserFooter;