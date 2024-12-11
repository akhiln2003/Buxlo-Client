import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";

function forgotPassword() {
  return (
    <div className="dark:bg-zinc-900 min-h-screen">
    <div className="w-full">
      <div className="w-full flex justify-between items-center pt-12 px-[2rem]">
        <Link to={MentorUrl.signIn} className="flex items-center group">
          <div className="relative w-5 h-5 items-start">
            <ChevronLeft
              className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full"
              strokeWidth={2.5}
            />
            <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
          </div>
          <span className="ml-1 font-cabinet text-sm">BACK</span>
        </Link>
      </div>
    </div>
    <div className="w-full my-[2rem] flex flex-col items-center justify-center">
      <div className="w-2/5">
        <div className="w-full flex flex-col items-center mt-[5rem]">
          <p className="text-2xl font-semibold font-supreme">
            FORGOT PASSWORD
          </p>
        </div>
        <div className="w-full flex flex-col items-center justify-center mt-[1rem]">
          <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
         Please enter your registered email 
          </p>
        </div>

        <div className="w-full  flex flex-row justify-center items-center mt-5">
          < ForgotPasswordForm />
        </div>
      </div>
    </div>
  </div>

  )
}

export default forgotPassword