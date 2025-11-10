import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "@/assets/images/logoWhite.png";
import logoBlack from "@/assets/images/logoBlack-.png";
import { LogIn, LogOut, Menu, Sun, SunMoon, User, X } from "lucide-react";
import profileImage from "@/assets/images/dummy-profile.webp";
import { motion, AnimatePresence } from "framer-motion";
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
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/contexts/themeContext";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import { errorTost } from "../ui/tosastMessage";
import { useSignOutAdminMutation } from "@/services/apis/AuthApis";
import { addUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import NotificationDropdown from "../common/notification/notificationDropdown";
import { House, Users, BriefcaseBusiness, Megaphone, Dock } from "lucide-react";

function AdminNavbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const [signOut] = useSignOutAdminMutation();
  const { user } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const navigateSignIn = () => {
    navigate(AdminUrls.signIn);
  };

  const handleSignOutUser = async () => {
    const response: IAxiosResponse = await signOut(user?.email);
    if (response.data) {
      dispatch(addUser(null));
      navigate(AdminUrls.signIn);
    } else {
      errorTost(
        "Something went wrong",
        response.error.data.error || [
          { message: `${response.error.data} please try again later` },
        ]
      );
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const userAvatar = user?.avatar || profileImage;
  const isAuthenticated = user?.role === USER_ROLE.ADMIN;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-gray-200/20 dark:border-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to={AdminUrls.home} className="block">
                <img
                  src={isDarkMode ? logoWhite : logoBlack}
                  alt="BUXLo Logo"
                  className="h-10 w-auto sm:h-12 md:h-14"
                />
              </Link>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationDropdown
                notificationsUrl={AdminUrls.notifications}
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
                          {user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("#")}>
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
                  {!isAuthenticated ? (
                    <DropdownMenuItem onClick={navigateSignIn}>
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
              <NotificationDropdown
                notificationsUrl={AdminUrls.notifications}
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
                  {isAuthenticated && (
                    <div
                      className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                      onClick={() => {
                        navigate("#");
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
                            {user?.name || "Admin"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <Link
                    to={AdminUrls.dashboard}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <House size={20} className="mr-3" />
                    Dashboard
                  </Link>

                  <Link
                    to={AdminUrls.userManagement}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Users size={20} className="mr-3" />
                    Users
                  </Link>

                  <Link
                    to={AdminUrls.mentorManagement}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <BriefcaseBusiness size={20} className="mr-3" />
                    Mentors
                  </Link>

                  <Link
                    to={AdminUrls.advManagement}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Megaphone size={20} className="mr-3" />
                    Advertisements
                  </Link>

                  <Link
                    to={AdminUrls.verifyprofile}
                    className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Dock size={20} className="mr-3" />
                    KYC Verification
                  </Link>

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

                    {!isAuthenticated ? (
                      <button
                        onClick={() => {
                          navigateSignIn();
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
    </>
  );
}

export default AdminNavbar;
