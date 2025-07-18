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
import {
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  Sun,
  SunMoon,
  User,
  X,
} from "lucide-react";
import profileImage from "@/assets/images/dummy-profile.webp";
import { motion } from "framer-motion";
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
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import NotificationDropdown from "../common/notification/notificationDropdown";

function AdminNavbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const [signOut] = useSignOutAdminMutation();

  const { user } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch();

  const navigateSignIn = () => {
    navigate(AdminUrls.signIn);
  };

  const handleSignOutUser = async () => {
    const response: IaxiosResponse = await signOut(user?.email);
    if (response.data) {
      dispatch(addUser(null));
      navigate(AdminUrls.signIn);
    } else {
      errorTost(
        "Somthing when wrong ",
        response.error.data.error || [
          { message: `${response.error.data} please try again laiter` },
        ]
      );
    }
  };

  return (
    <>
      <nav className=" top-0 left-0 right-0  dark:bg-zinc-950 ">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Logo */}
            <div className="flex-shrink-0 ">
              <Link to={AdminUrls.home}>
                <img
                  src={isDarkMode ? logoWhite : logoBlack}
                  alt="BUXLo Logo"
                  className="h-16 w-auto "
                />
              </Link>
            </div>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationDropdown
                notificationsUrl={AdminUrls.notifications}
                onNotificationClick={() => {}}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer">
                    {user?.avatar ? (
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
                    {/* <ChevronDown color='#6e6e6e' size={25} className='mt-1' /> */}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-9 min-w-[12rem]">
                  <DropdownMenuLabel>
                    <div className="flex cursor-pointer items-center  justify-start   ">
                      {user?.avatar ? (
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
                    <Link to={"#"} className="flex">
                      <User size={15} />
                      <span className="ml-[0.5rem]">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    <button className="flex">
                      {isDarkMode ? (
                        <Sun color="white" strokeWidth={1.5} size={19} />
                      ) : (
                        <SunMoon strokeWidth={1.5} />
                      )}
                      <span className="ml-[0.5rem]">Theme</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={"#"} className="flex">
                      <Sparkles size={15} strokeWidth={2.5} />
                      <span className="ml-[0.5rem]">Subscription</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role !== USER_ROLE.ADMIN ? (
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
                            This action cannot be undu. This will sign you out
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
            <div className="md:hidden flex items-center space-x-2">
              <NotificationDropdown
                notificationsUrl={AdminUrls.notifications}
                onNotificationClick={() => {}}
              />
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-gray-900"
                initial={{ rotate: 0 }}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
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
              <a
                href="#"
                className="block px-3 py-2 text-gray-500 hover:text-gray-900  "
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                PAGES
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                ABOUT
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                Contact
              </a>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
