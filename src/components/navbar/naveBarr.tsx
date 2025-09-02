import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "@/assets/images/logoWhite.png";
import logoBlack from "@/assets/images/logoBlack-.png";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Sun,
  SunMoon,
  User,
  X,
  FolderOpen,
  HelpCircle,
  Crown,
} from "lucide-react";
import profileImage from "@/assets/images/dummy-profile.webp";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useTheme } from "@/contexts/themeContext";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/slices/userSlice";
import { useSignOutUserMutation } from "@/services/apis/AuthApis";
import { errorTost } from "../ui/tosastMessage";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import NotificationDropdown from "../common/notification/notificationDropdown";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
} from "@/services/apis/MentorApis";
import { useGetUser } from "@/hooks/useGetUser";
import SubscriptionModal from "../common/subscription/SubscriptionModal";
import { useFetchUserProfileMutation } from "@/services/apis/UserApis";

// Define the interface for navigation items
interface NavigationItem {
  name: string;
  url: string;
  icon?: React.ReactNode;
  className?: string;
}

interface PageCategory {
  name: string;
  icon: React.ReactNode;
  routes: NavigationItem[];
}

interface NavbarProps {
  role: USER_ROLE.USER | USER_ROLE.MENTOR;
  homeUrl: string;
  dashboardUrl?: string;
  notificationsUrl: string;
  profileUrl: string;
  subscriptionUrl?: string;
  signInUrl: string;
  navigationItems?: NavigationItem[];
  pageCategories?: PageCategory[];
  showCenterNavigation?: boolean;
  customSignOutMutation?: (email: string) => Promise<IAxiosResponse>;
}

// Default navigation items for different roles
const getDefaultNavigationItems = (
  role: USER_ROLE.USER | USER_ROLE.MENTOR
): NavigationItem[] => {
  switch (role) {
    case USER_ROLE.USER:
      return [
        { name: "About", url: UserUrls.about },
        { name: "Contact", url: UserUrls.contact },
      ];
    case USER_ROLE.MENTOR:
      return [
        { name: "About", url: MentorUrl.about },
        { name: "Contact", url: MentorUrl.contact },
      ];
    default:
      return [];
  }
};

// Default page categories for different roles
const getDefaultPageCategories = (
  role: USER_ROLE.USER | USER_ROLE.MENTOR
): PageCategory[] => {
  switch (role) {
    case USER_ROLE.USER:
      return [
        {
          name: "User Dashboard",
          icon: <FolderOpen size={16} />,
          routes: [
            { name: "Profile", url: UserUrls.profile },
            { name: "Subscription", url: UserUrls.subscription },
            { name: "Dashboard", url: UserUrls.dashboard },
            { name: "Mentor List", url: UserUrls.listMentors },
          ],
        },
        {
          name: "Communication",
          icon: <MessageCircle size={16} />,
          routes: [{ name: "Chat", url: UserUrls.chat }],
        },
        {
          name: "Support",
          icon: <HelpCircle size={16} />,
          routes: [
            { name: "Contact", url: UserUrls.contact },
            { name: "About Us", url: UserUrls.about },
          ],
        },
      ];
    case USER_ROLE.MENTOR:
      return [
        {
          name: "Mentor Dashboard",
          icon: <FolderOpen size={16} />,
          routes: [
            { name: "Profile", url: MentorUrl.profile },
            { name: "Appointment", url: MentorUrl.appointment },
            { name: "Students", url: MentorUrl.signIn },
            { name: "Sessions", url: MentorUrl.signIn },
          ],
        },
        {
          name: "Communication",
          icon: <MessageCircle size={16} />,
          routes: [{ name: "Chat", url: MentorUrl.chat }],
        },
        {
          name: "Support",
          icon: <HelpCircle size={16} />,
          routes: [
            { name: "Contact", url: MentorUrl.contact },
            { name: "About Us", url: MentorUrl.about },
          ],
        },
      ];
    default:
      return [];
  }
};

function ReusableNavbar({
  role,
  homeUrl,
  dashboardUrl,
  notificationsUrl,
  profileUrl,
  signInUrl,
  navigationItems,
  pageCategories,
  showCenterNavigation = true,
  customSignOutMutation,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isPageMenuOpen, setIsPageMenuOpen] = useState<boolean>(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(
    null
  );
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
    useState<boolean>(false);

  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [signOut] = useSignOutUserMutation();
  const user = useGetUser();
  const dispatch = useDispatch();
  const [fetchProfileImage] = useFetchMentorProfileImageMutation();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [fetchUserProfileData] = useFetchUserProfileMutation();
  const [fetchMentorProfileData] = useFetchMentorProfileMutation();

  // Use provided navigation items or default ones
  const finalNavigationItems =
    navigationItems || getDefaultNavigationItems(role);
  const finalPageCategories = pageCategories || getDefaultPageCategories(role);

  const handleSignOutUser = async (): Promise<void> => {
    try {
      const signOutFunction = customSignOutMutation || signOut;
      const response: IAxiosResponse = await signOutFunction(user?.email || "");
      if (response.data) {
        dispatch(addUser(null));
        navigate(signInUrl);
      } else {
        errorTost(
          "Something went wrong",
          response.error?.data?.error || [
            { message: `${response.error?.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("Sign out error:", error);
      errorTost("Sign out failed", [{ message: "Please try again later" }]);
    }
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
    setIsPageMenuOpen(false);
    setActiveCategoryIndex(null);
  };

  const toggleCategory = (index: number): void => {
    setActiveCategoryIndex(activeCategoryIndex === index ? null : index);
  };

  const handleSubscriptionClick = (): void => {
    setIsSubscriptionModalOpen(true);
  };

  const isAuthenticated = user?.role === role;
  const userAvatar = profilePhoto || profileImage;
  const [isPremium, setPremium] = useState<boolean>(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.avatar) {
          const folderName =
            user.role == "user" ? "UserProfiles/" : "MentorProfiles/";

          const imageUrl: IAxiosResponse = await fetchProfileImage([
            `${folderName}${user.avatar}`,
          ]);
          if (imageUrl.data.imageUrl) {
            setProfilePhoto(imageUrl.data.imageUrl[0]);
          } else {
            errorTost(
              "Image Load Failed",
              imageUrl.error.data.error || [
                { message: `${imageUrl.error.data} please try again later` },
              ]
            );
          }
        }
      } catch (err) {
        console.error("Error wile fetching profile image ", err);

        errorTost("Data Load Failed", [
          { message: "Faild to fetch profile image" },
        ]);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: IAxiosResponse =
          user?.role == USER_ROLE.USER
            ? await fetchUserProfileData(user!.id)
            : await fetchMentorProfileData(user!.id);

        if (response.data.data) {
          setPremium(response.data.data.premiumId ? true : false);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        errorTost("Data Load Failed", [
          { message: "Something went wrong please try again" },
        ]);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-gray-200/20 dark:border-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to={homeUrl} className="block">
                <img
                  src={isDarkMode ? logoWhite : logoBlack}
                  alt="BUXLo Logo"
                  className="h-10 w-auto sm:h-12 md:h-14"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            {showCenterNavigation && (
              <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                {/* Dashboard Link */}
                {role === USER_ROLE.USER ? (
                  dashboardUrl && (
                    <Link
                      to={dashboardUrl}
                      className="text-sm font-extrabold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 uppercase tracking-wide"
                    >
                      Dashboard
                    </Link>
                  )
                ) : (
                  <Link
                    to={MentorUrl.appointment}
                    className="text-sm font-extrabold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 uppercase tracking-wide"
                  >
                    Appointment
                  </Link>
                )}

                {/* Pages Dropdown */}
                {finalPageCategories.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center text-sm font-extrabold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 uppercase tracking-wide">
                        Pages <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto p-4 mt-2 min-w-[600px]">
                      <div className="grid grid-cols-3 gap-6">
                        {finalPageCategories.map((category, index) => (
                          <div key={index} className="min-w-[180px]">
                            <div className="flex items-center px-3 py-2 mb-3 bg-gray-100 dark:bg-zinc-800 rounded-md">
                              <span className="mr-2 text-gray-600 dark:text-gray-300">
                                {category.icon}
                              </span>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {category.name}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {category.routes.map((route, routeIndex) => (
                                <DropdownMenuItem key={routeIndex} asChild>
                                  <Link
                                    to={route.url}
                                    className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors duration-200 cursor-pointer"
                                  >
                                    {route.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Additional Navigation Items */}
                {finalNavigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.url}
                    className={`text-sm font-extrabold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 uppercase tracking-wide ${
                      item.className || ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-4 pr-0 mr-0">
              {/* Subscription Icon */}
              {!isPremium && (
                <motion.button
                  onClick={handleSubscriptionClick}
                  className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  title="Upgrade to Premium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Crown className="w-4 h-4" />
                  </motion.div>
                  <span className="text-xs font-semibold">Premium</span>
                </motion.button>
              )}

              <NotificationDropdown
                notificationsUrl={notificationsUrl}
                onNotificationClick={() => {}}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200">
                    <img
                      src={userAvatar}
                      alt="User profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-4">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3">
                      <img
                        src={userAvatar}
                        alt="User profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold capitalize">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(profileUrl)}>
                    <User size={16} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {isDarkMode ? (
                      <Sun size={16} className="mr-2" />
                    ) : (
                      <SunMoon size={16} className="mr-2" />
                    )}
                    Theme
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem onClick={handleSubscriptionClick}>
                      <Crown size={16} className="mr-2" />
                      Subscription
                    </DropdownMenuItem>
                  )}
                  {!isAuthenticated ? (
                    <DropdownMenuItem onClick={() => navigate(signInUrl)}>
                      <LogIn size={16} className="mr-2" />
                      Sign In
                    </DropdownMenuItem>
                  ) : (
                    <AlertDialog>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-red-600 focus:text-red-600"
                      >
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center cursor-pointer w-full">
                            <LogOut size={16} className="mr-2" />
                            Sign Out
                          </div>
                        </AlertDialogTrigger>
                      </DropdownMenuItem>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will sign you out
                            from BUXLo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSignOutUser}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Subscription Icon */}
              {!isPremium && (
                <button
                  onClick={handleSubscriptionClick}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                  title="Subscription Plans"
                >
                  <Crown className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Notifications */}
              <NotificationDropdown
                notificationsUrl={notificationsUrl}
                onNotificationClick={() => {}}
              />

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                initial={{ rotate: 0 }}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800"
              >
                <div className="px-2 pt-4 pb-6 space-y-1">
                  {/* Mobile Profile Section */}
                  <div
                    className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                    onClick={() => {
                      navigate(profileUrl);
                      closeMobileMenu();
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={userAvatar}
                        alt="User profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                          {user?.name || "User"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || "Sign in to access your account"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  {showCenterNavigation && (
                    <>
                      {dashboardUrl && (
                        <Link
                          to={dashboardUrl}
                          className="block px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                          onClick={closeMobileMenu}
                        >
                          Dashboard
                        </Link>
                      )}

                      {/* Mobile Pages Menu */}
                      {finalPageCategories.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() => setIsPageMenuOpen(!isPageMenuOpen)}
                            className="flex w-full px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md items-center justify-between transition-colors duration-200"
                          >
                            Pages
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isPageMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isPageMenuOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden ml-3 mt-1"
                              >
                                {finalPageCategories.map((category, index) => (
                                  <div key={index} className="py-1">
                                    <button
                                      onClick={() => toggleCategory(index)}
                                      className="flex w-full items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                                    >
                                      <div className="flex items-center">
                                        <span className="mr-2 text-gray-500 dark:text-gray-400">
                                          {category.icon}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {category.name}
                                        </span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                          activeCategoryIndex === index
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </button>
                                    <AnimatePresence>
                                      {activeCategoryIndex === index && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          {category.routes.map(
                                            (route, routeIndex) => (
                                              <Link
                                                key={routeIndex}
                                                to={route.url}
                                                onClick={closeMobileMenu}
                                                className="flex items-center px-6 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                                              >
                                                {route.name}
                                              </Link>
                                            )
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Additional Mobile Navigation Items */}
                      {finalNavigationItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.url}
                          className={`block px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200 ${
                            item.className || ""
                          }`}
                          onClick={closeMobileMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Mobile Quick Actions */}
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <button
                      onClick={() => {
                        toggleTheme();
                        closeMobileMenu();
                      }}
                      className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    >
                      {isDarkMode ? (
                        <Sun size={16} className="mr-3" />
                      ) : (
                        <SunMoon size={16} className="mr-3" />
                      )}
                      <span className="text-sm">Toggle Theme</span>
                    </button>

                    {!isPremium && (
                      <motion.button
                        onClick={handleSubscriptionClick}
                        className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        title="Upgrade to Premium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, -10, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          <Crown className="w-4 h-4" />
                        </motion.div>
                        <span className="text-xs font-semibold">Premium</span>
                      </motion.button>
                    )}

                    {!isAuthenticated ? (
                      <button
                        onClick={() => {
                          navigate(signInUrl);
                          closeMobileMenu();
                        }}
                        className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                      >
                        <LogIn size={16} className="mr-3" />
                        <span className="text-sm">Sign In</span>
                      </button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200">
                            <LogOut size={16} className="mr-3" />
                            <span className="text-sm">Sign Out</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will sign you
                              out from BUXLo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSignOutUser}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </>
  );
}

export default ReusableNavbar;
