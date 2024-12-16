import bgImg from "@/assets/images/wave.svg";
import { SigninForm } from "../components/SignInForm";

function SignIn() {
  return (
    <div className=" w-full flex relative m-0">
      {/* Blurred Background */}
      <div
        style={{ backgroundImage: `url(${bgImg})` }}
        className="w-full min-h-screen bg-cover bg-center blur-lg absolute "
      ></div>

      {/* Content Container */}
      <div className="w-full min-h-screen flex items-center justify-center relative z-10 ">
        <div className="w-4/12 min-w-72 bg-white dark:bg-black/40 p-10 rounded-lg shadow-lg ">
          < SigninForm />
          {/* Add your form or content here */}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
