
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { USER_ROLE } from "@/@types/userRoleEnum";
import qrCodeImage from "@/assets/images/dummyQrCode.webp";
import ReusableFooter from "./ReusableFooterComponent";

function MentorFooter() {
  const mentorSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", url: MentorUrl.home },
        { name: "Profile", url: MentorUrl.profile },
        { name: "Appointments", url: MentorUrl.appointment },
         { name: "Chat", url: MentorUrl.chat },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "Contact Us", url: MentorUrl.contact },
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
      sections={mentorSections}
      contactEmail="mentors@buxlo.com"
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
      role={USER_ROLE.MENTOR}
    />
  );
}

export default MentorFooter;