import { Link, useNavigate } from "react-router-dom";
import logoWhite from "@/assets/images/logoWhite.png";
import { Mail, Phone, MapPin } from "lucide-react";
import { useGetUser } from "@/hooks/useGetUser";
import { USER_ROLE } from "@/@types/userRoleEnum";

interface FooterLink {
  name: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface ReusableFooterProps {
  sections: FooterSection[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  qrCodeImage?: string;
  qrCodeLabel?: string;
  userSignInUrl: string;
  mentorSignInUrl: string;
  role: USER_ROLE.USER | USER_ROLE.MENTOR;
}

function ReusableFooter({
  sections,
  contactEmail,
  contactPhone,
  contactAddress,
  socialLinks,
  qrCodeImage,
  qrCodeLabel = "Scan the QR code to download the app",
  userSignInUrl,
  mentorSignInUrl,
  role,
}: ReusableFooterProps) {
  const currentYear = new Date().getFullYear();
  const user = useGetUser();
  const navigate = useNavigate();

  // Determine if user is authenticated
  const isAuthenticated = user?.role === role;

  // Handle footer link click - redirect to login if not authenticated
  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      // Redirect to appropriate login page based on role
      const signInUrl =
        role === USER_ROLE.USER ? userSignInUrl : mentorSignInUrl;
      navigate(signInUrl);
    } else {
      // Scroll to top of page when authenticated user clicks a link
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-black dark:bg-black text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Info Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-6">
              <img src={logoWhite} alt="BUXLo Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Empowering financial growth through expert mentorship and
              intelligent tools.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Mail size={16} />
                  <span className="text-sm">{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Phone size={16} />
                  <span className="text-sm">{contactPhone}</span>
                </a>
              )}
              {contactAddress && (
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{contactAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.url}
                      onClick={(e) => handleFooterLinkClick(e)}
                      className={`transition-colors duration-200 text-sm ${
                        isAuthenticated
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-400 hover:text-blue-400 cursor-pointer"
                      }`}
                      title={
                        !isAuthenticated
                          ? `Sign in to access ${link.name}`
                          : undefined
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* QR Code Section */}
          {qrCodeImage && (
            <div className="flex flex-col items-center justify-start">
              <div className="bg-white p-3 rounded-lg mb-3">
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <p className="text-gray-400 text-xs text-center">{qrCodeLabel}</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {currentYear} BUXLO. All rights reserved.
          </p>

          {/* Social Links */}
          {socialLinks &&
            Object.keys(socialLinks).some(
              (key) => socialLinks[key as keyof typeof socialLinks]
            ) && (
              <div className="flex items-center gap-4 mt-6 md:mt-0">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 002.856-3.64 9.88 9.88 0 01-2.828.856 4.94 4.94 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.93 4.93 0 00-8.506 4.482 13.978 13.978 0 01-10.15-5.144 4.93 4.93 0 001.524 6.573 4.903 4.903 0 01-2.235-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.938 4.938 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5m3.5-10.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5m-9-1c0-.553.447-1 1-1s1 .447 1 1v.01c0 .552-.447 1-1 1s-1-.448-1-1v-.01z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
        </div>
      </div>
    </footer>
  );
}

export default ReusableFooter;
