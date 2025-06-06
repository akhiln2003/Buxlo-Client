// import logoIconWhite from '@/assets/images/logoIconWhite.png';

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import FbIcon from "@/assets/images/fbIcon.png";
import AppleIcon from "@/assets/images/AppleIcon.png";
import TraditionalLoginIcon from "@/assets/images/TraditionalLoginIcon.png";
import { useState } from "react";
import { IsignUpOptionProps } from "../@types/Iprops";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { addUser } from "@/redux/slices/userSlice";
import { errorTost } from "@/components/ui/tosastMessage";
import { useDispatch } from "react-redux";
import { useGoogleAuthMentMutation } from "@/services/apis/AuthApis";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useTheme } from "@/contexts/themeContext";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";

function SignUpOptions({ setIsFormVisible }: IsignUpOptionProps) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [googleAuth] = useGoogleAuthMentMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const handilShowMore = () => {
    setShowMore(true);
  };

  const navigateForm = () => {
    setIsFormVisible(true);
  };

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

          navigate(MentorUrl.home);
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
      errorTost("Failed to sign in", [
        { message: "Somting when wrong please try again" },
      ]);
    }
  };
  const handleGoogleAthError = () => {
    errorTost("Failed to sign in", [
      { message: "Somting when wrong please try again" },
    ]);
  };
  const googlTheam = isDarkMode ? "filled_black" : "outline";

  return (
    <>
      <div className=" dark:bg-zinc-900 min-h-screen">
        <div className="w-full" style={{}}>
          <div className="w-full flex justify-between items-center pt-12 px-[2rem] ">
            <Link to={MentorUrl.home} className="flex items-center  group">
              <div className="relative w-5 h-5 items-start">
                <ChevronLeft
                  className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full"
                  strokeWidth={2.5}
                />
                <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
              </div>
              <span className="ml-1 font-cabinet text-sm">BACK</span>
            </Link>

            <Link to={MentorUrl.signIn}>
              <span className="font-cabinet font-semibold text-xs relative group">
                SIGN IN
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-[5rem] ">
          <p className="text-2xl font-semibold font-supreme">
            Create Your Account
          </p>
        </div>
        <div className="w-full flex flex-col items-center justify-center  mt-[2rem]">
          <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
            By creating an account, you agree to our{" "}
            <span className=" underline ">Terms of Service</span>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium ">
            and have read and understood the{" "}
            <span className=" underline">Privacy Policy</span>
          </p>
        </div>
        <div className="w-full flex flex-col items-center ">
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

          {showMore ? (
            <>
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

              <div
                onClick={() => navigateForm()}
                className="relative group w-[21.5rem] h-14 border border-zinc-900 dark:border-zinc-600 mt-[0.7rem] pl-[1rem] flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 dark:from-zinc-600 to-slate-100 dark:to-zinc-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-all duration-100"></div>
                <div className="w-6 rounded overflow-hidden m-[1rem] relative z-10">
                  <img src={TraditionalLoginIcon} alt="emailIcon" />
                </div>
                <p className="font-cabinet font-semibold text-sm ml-[1.7rem] relative z-10">
                  Continue with Email
                </p>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium mt-[2rem]">
                Secure Login with reCAPTCHA subject to Google
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
                <span className="underline">Terms</span> &{" "}
                <span className="underline">Privacy</span>
              </p>
            </>
          ) : (
            <>
              <div
                onClick={() => navigateForm()}
                className="relative group w-[21.5rem] h-14 border border-zinc-900 dark:border-zinc-600 mt-[0.7rem] pl-[1rem] flex items-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 dark:from-zinc-600 to-slate-100 dark:to-zinc-600 scale-x-0 group-hover:scale-x-100 transform origin-left transition-all duration-100"></div>
                <div className="w-6 rounded overflow-hidden m-[1rem] relative z-10">
                  <img src={TraditionalLoginIcon} alt="emailIcon" />
                </div>
                <p className="font-cabinet font-semibold text-sm ml-[2rem] relative z-10">
                  Continue with Email
                </p>
              </div>

              <span
                className="font-cabinet font-light text-sm relative group mt-[2rem] cursor-pointer"
                onClick={() => handilShowMore()}
              >
                More options
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium mt-[2rem]">
                Secure Login with reCAPTCHA subject to Google
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
                <span className="underline">Terms</span> &{" "}
                <span className="underline">Privacy</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SignUpOptions;
