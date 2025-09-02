import logoIconWhite from "@/assets/images/logoIconWhite.png";
import logoIconBlack from "@/assets/images/logoIconBlack.png";
import { Link, useNavigate } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { ArrowLeft, ChevronLeft } from "lucide-react";
// import GitHubIcon from '@/assets/images/GitHubIcon.png';
import FbIcon from "@/assets/images/fbIcon.png";
import AppleIcon from "@/assets/images/AppleIcon.png";
import { SigninForm } from "../components/SignInForm";
import { useTheme } from "@/contexts/themeContext";
import { useGoogleAuthUserMutation } from "@/services/apis/AuthApis";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/slices/userSlice";
import { errorTost } from "@/components/ui/tosastMessage";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";

function SignIn() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthUserMutation();
  const dispatch = useDispatch();

  const handleGoogleSignUp = async (respons: GoogleCredentialResponse) => {
    try {
      if (respons?.credential) {
        // Call your API to handle Google login or signup
        const response: IaxiosResponse = await googleAuth({
          token: respons.credential,
        });

        if (response.data?.user) {
          const user = response.data.user;
          dispatch(addUser(user));

          navigate(UserUrls.home);
        } else {          
          errorTost(
            "Somthing when wrong ",
            response.error.data.error || [
              { message: `${response.error.data} please try again laiter` },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error during Google signup:", error);
    }
  };
  const handleGoogleAthError = () => {
    errorTost("Faild to sing in ", [
      { message: "Somting when wrong please try again" },
    ]);
  };
  const handleResendPassword = () => {
    navigate(UserUrls.forgotPassword);
  };

  const googlTheam = isDarkMode ? "filled_black" : "outline";
  return (
    <>
      <div className=" dark:bg-zinc-900  min-h-screen">
        <div className="w-full ">
          <div className="w-full flex justify-between items-center pt-12 px-[2rem] ">
            <Link to={UserUrls.home} className="flex items-center  group">
              <div className="relative w-5 h-5 items-start">
                <ChevronLeft
                  className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full"
                  strokeWidth={2.5}
                />
                <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
              </div>
              <span className="ml-1 font-cabinet text-sm">BACK</span>
            </Link>

            <Link to={UserUrls.signUp}>
              <span className="font-cabinet font-semibold text-xs relative group">
                CREATE ACCOUNT
                <span className="absolute  bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-[3rem] ">
          <div className="w-10  ">
            <img
              src={isDarkMode ? logoIconWhite : logoIconBlack}
              alt="BUXLO ICON"
            />
          </div>
          <p className="text-2xl font-semibold font-supreme">Sign Into Buxlo</p>
        </div>
        <div className="w-full flex items-center justify-center  mt-[3rem]">
          <div className="w-[55rem] h-fit flex justify-center ">
            <div className="w-1/2  h-full flex flex-col px-[2rem]">
              <SigninForm />
            </div>
            <div className="h-full flex flex-col justify-between items-center">
              <div className="h-[6rem] bg-zinc-500 dark:bg-zinc-300 w-0.5"></div>
              <span className="text-zinc-800 dark:text-zinc-400 font-cabinet font-semibold text-sm">
                OR
              </span>
              <div className="h-[6rem] bg-zinc-500 dark:bg-zinc-300 w-0.5"></div>
            </div>

            <div className="w-1/2 h-fit flex py-3">
              <div className="w-full flex flex-col items-center  ">
                {/* Google Login button */}
                <div className="w-[21.5rem] h-14  mt-[0.7rem] flex items-center overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSignUp}
                    onError={handleGoogleAthError}
                    shape="rectangular"
                    size="large"
                    width="350px"
                    theme={googlTheam}
                  />
                </div>
                <div className="relative group w-[21.5rem] h-14 border border-zinc-900 dark:border-zinc-600 mt-[0.7rem] pl-[1rem] flex items-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 dark:from-zinc-600 to-slate-100 dark:to-zinc-600  scale-x-0 group-hover:scale-x-125 transform origin-left transition-all duration-100"></div>
                  <div className="w-10 rounded overflow-hidden m-[0.3rem] relative z-10">
                    <img src={AppleIcon} alt="appleIcon" />
                  </div>
                  <p className="font-cabinet font-semibold text-sm ml-[1.9rem] relative z-10">
                    Continue with AppleId
                  </p>
                </div>
                <div className="relative group w-[21.5rem] h-14 border border-zinc-900 dark:border-zinc-600 mt-[0.7rem] pl-[1rem] flex items-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 dark:from-zinc-600 to-slate-100 dark:to-zinc-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-all duration-100"></div>
                  <div className="w-6 rounded overflow-hidden m-[0.8rem] relative z-10">
                    <img src={FbIcon} alt="fbIcon" />
                  </div>
                  <p className="font-cabinet font-semibold text-sm ml-[1.9rem] relative z-10">
                    Continue with Facebook
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center"
          onClick={() => handleResendPassword()}
        >
          <span className="font-cabinet font-medium text-sm relative group mt-[2rem] cursor-pointer">
            Can’t log in?
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex flex-col items-start">
            <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium mt-[2rem]">
              Secure Login with reCAPTCHA subject to Google
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium ">
              <span className="underline">Terms</span> &{" "}
              <span className="underline">Privacy</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
