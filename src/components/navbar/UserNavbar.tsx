import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWhite from "@/assets/images/logoWhite.png";
import logoBlack from "@/assets/images/logoBlack-.png";
import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Sparkles,
  Sun,
  SunMoon,
  User,
  X,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import profileImage from "@/assets/images/dummy-profile.webp";
import { motion } from "framer-motion";
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

import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { useTheme } from "@/contexts/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addUser } from "@/redux/slices/userSlice";
import { useSignOutUserMutation } from "@/services/apis/AuthApis";
import { errorTost } from "../ui/tosastMessage";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";

// Define page categories and their related routes
const pageCategories = [
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
      { name: "About Us", url: "/about" }, // Assuming "/about" is the correct URL
    ],
  },
];

function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPageMenuOpen, setIsPageMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [signOut] = useSignOutUserMutation();

  const { user } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const navigateSignIn = () => {
    navigate(UserUrls.signIn);
    setIsOpen(false);
  };

  const navigateToProfile = () => {
    navigate(UserUrls.profile);
    setIsOpen(false);
  };

  const handleSignOutUser = async () => {
    const response: IaxiosResponse = await signOut(user?.email);
    if (response.data) {
      dispatch(addUser(null));
      navigate(UserUrls.signIn);
    } else {
      errorTost(
        "Something went wrong ",
        response.error.data.error || [
          { message: `${response.error.data} please try again later` },
        ]
      );
    }
  };
  const colorTheam = isDarkMode ? "white" : "black";

  // Function to handle link clicks and close the dropdown
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsPageMenuOpen(false);
    setActiveCategoryIndex(null);
    setIsOpen(false);
  };

  // Toggle category expansion
  const toggleCategory = (index: number) => {
    setActiveCategoryIndex(activeCategoryIndex === index ? null : index);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-50 w-full">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Logo */}
            <div className="flex-shrink-0 ">
              <Link to={UserUrls.home}>
                <img
                  src={isDarkMode ? logoWhite : logoBlack}
                  alt="BUXLo Logo"
                  className="h-16 w-auto "
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 font-extrabold text-base uppercase">
              <Link
                to={UserUrls.dashboard}
                className="text-gray-900 dark:text-white hover:text-gray-500"
              >
                DASHBORD
              </Link>

              {/* Pages Dropdown */}
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    PAGES <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit p-5 mt-2">
                  <div className="flex space-x-14">
                    {pageCategories.map((category, index) => (
                      <div key={index} className="min-w-40">
                        <div className="flex items-center px-2 py-1.5 mb-2 bg-gray-100 dark:bg-zinc-800 rounded-md">
                          <span className="mr-2 text-gray-600 dark:text-gray-300">
                            {category.icon}
                          </span>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                            {category.name}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {category.routes.map((route, routeIndex) => (
                            <Link
                              key={routeIndex}
                              to={route.url}
                              onClick={handleLinkClick}
                              className="flex items-center px-4 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors"
                            >
                              {route.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/about"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                ABOUT
              </Link>
              <Link
                to={UserUrls.contact}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white "
              >
                CONTACT
              </Link>
            </div>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Bell size={25} strokeWidth={1.5} color={colorTheam} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-9 w-[25rem] h-[25rem] pt-5 overflow-y-scroll scrollbar-thin dark:scrollbar-track-zinc-900 scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-500 scrollbar-track-gray scrollbar-track-rounded-full ">
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3">
                    <MessageCircle />
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b py-3">
                    <MessageCircle />
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-b h-fit py-3 px-2">
                    Completed a daily challenge for October LeetCoding Challenge
                    2024LeetCoin+10
                  </DropdownMenuItem>

                  <div className="absolute pr-[2rem] flex justify-end items-center bottom-0 left-0 w-[25rem] h-10 rounded-b-md bg-gray-100 dark:bg-zinc-950 py-3 shadow-sm shadow-gray-600 ">
                    <DropdownMenuItem className=" ">...</DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer">
                    {user?.avatar && user.role == USER_ROLE.USER ? (
                      <img
                        src={user?.avatar}
                        alt="User profile"
                        className="h-8 w-8 rounded-full overflow-hidden object-cover"
                      />
                    ) : (
                      <img
                        src={profileImage}
                        alt="User profile"
                        className="h-8 w-8 rounded-full overflow-hidden object-cover"
                      />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-9 min-w-[12rem]">
                  <DropdownMenuLabel>
                    <div className="flex cursor-pointer items-center justify-start">
                      {user?.avatar && user.role == USER_ROLE.USER ? (
                        <img
                          src={user?.avatar}
                          alt="User profile"
                          className="h-8 w-8 rounded-full overflow-hidden object-cover"
                        />
                      ) : (
                        <img
                          src={profileImage}
                          alt="User profile"
                          className="h-8 w-8 rounded-full overflow-hidden object-cover"
                        />
                      )}
                      <p className="ml-[0.5rem] font-semibold text-lg capitalize">
                        {user ? user.name : "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div
                      className="flex w-full"
                      onClick={() => navigate(UserUrls.profile)}
                    >
                      <User size={15} />
                      <span className="ml-[0.5rem]">Profile</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    <button className="flex">
                      {isDarkMode ? (
                        <Sun color="white" strokeWidth={1.5} size={19} />
                      ) : (
                        <SunMoon strokeWidth={1.5} />
                      )}
                      <span className="ml-[0.5rem]">Team</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={UserUrls.subscription} className="flex">
                      <Sparkles size={15} strokeWidth={2.5} />
                      <span className="ml-[0.5rem]">Subscription</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role != USER_ROLE.USER ? (
                    <DropdownMenuItem onClick={navigateSignIn}>
                      <LogIn size={20} />
                      <span className="ml-[0.5rem]">SignIn</span>
                    </DropdownMenuItem>
                  ) : (
                    <AlertDialog>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="w-full flex text-red-700"
                      >
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <LogOut size={20} />
                            <span className="ml-[0.5rem]">SignOut</span>
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
                            from buxlo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleSignOutUser()}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu - Reorganized with profile at top */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              isOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            className={`md:hidden overflow-hidden`}
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Profile section at the top - Made clickable to redirect to profile */}
              <div
                className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg mb-4 cursor-pointer"
                onClick={navigateToProfile}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {user?.avatar && user.role == USER_ROLE.USER ? (
                    <img
                      src={user?.avatar}
                      alt="User profile"
                      className="h-12 w-12 rounded-full overflow-hidden object-cover"
                    />
                  ) : (
                    <img
                      src={profileImage}
                      alt="User profile"
                      className="h-12 w-12 rounded-full overflow-hidden object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-lg text-gray-800 dark:text-white capitalize">
                      {user ? user.name : "User"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user ? user.email : "Sign in to access your account"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation options below the profile */}
              <Link
                to={UserUrls.dashboard}
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>

              {/* Mobile Pages Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsPageMenuOpen(!isPageMenuOpen)}
                  className="flex w-full px-3 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md items-center justify-between"
                >
                  Pages
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isPageMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    isPageMenuOpen
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-3"
                >
                  {pageCategories.map((category, index) => (
                    <div key={index} className="py-1">
                      <button
                        onClick={() => toggleCategory(index)}
                        className="flex w-full items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
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
                          className={`h-4 w-4 transition-transform ${
                            activeCategoryIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={
                          activeCategoryIndex === index
                            ? { height: "auto", opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {category.routes.map((route, routeIndex) => (
                          <Link
                            key={routeIndex}
                            to={route.url}
                            onClick={handleLinkClick}
                            className="flex items-center px-6 py-1.5 my-0.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
                          >
                            {route.name}
                          </Link>
                        ))}
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <Link
                to="/about"
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                onClick={handleLinkClick}
              >
                About
              </Link>
              <Link
                to={UserUrls.contact}
                className="block px-3 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                onClick={handleLinkClick}
              >
                Contact
              </Link>

              {/* Quick access options at the bottom - Removed Profile option */}
              <div className="pt-2 mt-3 border-t border-gray-200 dark:border-zinc-800">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
                >
                  {isDarkMode ? (
                    <Sun size={16} className="mr-2" />
                  ) : (
                    <SunMoon size={16} className="mr-2" />
                  )}
                  <span className="text-sm">Toggle Theme</span>
                </button>

                <Link
                  to={UserUrls.subscription}
                  className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                  onClick={handleLinkClick}
                >
                  <Sparkles size={16} className="mr-2" />
                  <span className="text-sm">Subscription</span>
                </Link>

                {user?.role != USER_ROLE.USER ? (
                  <button
                    onClick={navigateSignIn}
                    className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    <LogIn size={16} className="mr-2" />
                    <span className="text-sm">Sign In</span>
                  </button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer">
                        <LogOut size={16} className="mr-2" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will sign you out
                          from buxlo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSignOutUser()}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
}

export default UserNavbar;