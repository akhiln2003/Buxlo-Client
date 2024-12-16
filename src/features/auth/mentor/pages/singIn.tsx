import logoIconWhite from "@/assets/images/logoIconWhite.png";
import logoIconBlack from "@/assets/images/logoIconBlack.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useTheme } from "@/contexts/themeContext";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { SigninForm } from "../components/SignInForm";
import { useDispatch } from "react-redux";
import { useGoogleAuthMentMutation } from "@/services/apis/AuthApis";
import { addUser } from "@/redux/slices/userSlice";
import { errorTost } from "@/components/ui/tosastMessage";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";

import BGIMG from "@/assets/images/MentorLoginPageBG.avif";

function SignIn() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthMentMutation();
  const dispatch = useDispatch();

  const googlTheam = isDarkMode ? "filled_black" : "outline";

  const handleGoogleSignUp = async (respons: GoogleCredentialResponse) => {
    try {
      if (respons?.credential) {
        const response = await googleAuth({ token: respons.credential });
        if (response.data?.user) {
          const user = response.data.user;
          dispatch(addUser(user));
          navigate(MentorUrl.home);
        } else {
          errorTost("Something went wrong", "response.error.data.message");
        }
      }
    } catch (error) {
      console.error("Error during Google signup:", error);
    }
  };

  const handleGoogleAthError = () => {
    errorTost("Failed to sign in", "Something went wrong. Please try again");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-50"
        style={{
          backgroundColor: "#77aa77",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 2 1'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%2377aa77'/%3E%3Cstop offset='1' stop-color='%234fd'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='2' y2='2'%3E%3Cstop offset='0' stop-color='%23cf8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23cf8' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='2' height='1'/%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23b)' points='0 1 0 0 2 0'/%3E%3Cpolygon fill='url(%23c)' points='2 1 2 0 0 0'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 ">
        {/* Top Navigation */}
        <div className="w-full flex justify-between items-center mb-8 px-4">
          <Link
            to={MentorUrl.home}
            className="flex items-center group text-white"
          >
            <div className="relative w-5 h-5 mr-2">
              <ChevronLeft
                color="white"
                className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full"
                strokeWidth={2.5}
              />
              <ArrowLeft
                color="white"
                className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full"
              />
            </div>
            <span className="font-cabinet text-sm">BACK</span>
          </Link>

          <Link to={MentorUrl.signUp} className="text-white">
            <span className="font-cabinet font-semibold text-xs relative group">
              CREATE ACCOUNT
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-zinc-800 rounded-lg shadow-xl overflow-hidden">
          {/* Left Side - Sign In Form */}
          <div className="p-8 flex flex-col justify-center">
            <SigninForm />

            {/* Google Login */}
            <div className="w-full flex justify-center mt-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSignUp}
                  onError={handleGoogleAthError}
                  type="icon"
                  shape="circle"
                  theme={`${googlTheam}`}
                  size="medium"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Logo and Image */}
          <div className="hidden md:flex flex-col  p-8 items-center justify-between">
            <div className="w-full flex flex-col items-center mb-8">
              <div className="w-10 mb-4">
                <img
                  src={isDarkMode ? logoIconWhite : logoIconBlack}
                  alt="BUXLO ICON"
                  className="w-full"
                />
              </div>
              <p className="text-2xl font-semibold font-supreme  text-center">
                Sign Into Buxlo
              </p>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={BGIMG}
                alt="Background"
                className="max-w-full max-h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
