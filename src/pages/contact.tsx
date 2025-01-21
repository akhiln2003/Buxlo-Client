import ContactPageForm from "@/components/common/contact/ContactPageForm";
import { Mail, MapPin, Smartphone } from "lucide-react";

function contact() {
  return (
    <div className=" w-full flex flex-col ">
      <div className="w-full h-20 font-cabinet font-semibold text-2xl pl-[5rem] bg-violet-50 dark:bg-zinc-900 flex items-center p-5">
        Contact Us
      </div>

      <div className="w-full flex flex-col items-center mt-[3rem] space-y-5 p-5">
        <p className=" font-cabinet font-semibold text-3xl drop-shadow-2xl ">
          Contact Us
        </p>
        <p className="max-w-[30rem] text-center text-zinc-500 dark:text-zinc-200 ">
          Have Questions or Need Assistance? Reach Out to Us Anytime – We're
          Here to Support and Guide You Every Step of the Way!
        </p>
      </div>

      <div className=" w-full flex items-end mt-[3rem] pt-5 p-[5rem]">
        <p className=" font-cabinet font-semibold text-3xl drop-shadow-2xl flex items-end   ">
          Get in touch with us
        </p>
        <hr className=" w-10 mb-2 ml-3 bg-zinc-500 dark:bg-zinc-200 h-1 border-none " />
      </div>

      <div className=" w-full flex p-5 ">
        <div className="w-1/2  flex items-center">
          <ContactPageForm />
        </div>
        <div className="w-1/2 bg-gray-300"></div>
      </div>

      <div className="w-full  flex justify-center shadow-sm my-[5rem] ">
        <div className=" w-5/6  flex justify-between py-[3rem] shadow-2xl  ">
          <div className=" w-1/3 h-40  flex flex-col items-center justify-center space-y-2  ">
            <MapPin size={50} strokeWidth={1} className="mt-2" />
            <p className=" font-cabinet font-semibold text-2xl ">Meet us</p>
            <p className="max-w-[15rem]  text-zinc-500 font-cabinet ">
              23A, Tech Valley Road, Calicut City, Kozhikode, KL 673001
            </p>
          </div>
          <div className=" w-1/3 h-40  flex flex-col items-center justify-center space-y-2  ">
            <Smartphone size={50} strokeWidth={1} className="mt-2" />
            <p className=" font-cabinet font-semibold text-2xl ">Call us</p>
            <p className=" text-zinc-500 font-cabinet ">
              Phone : (1800) 456 789 <br />
              Fax : 1200 954 755
            </p>
          </div>
          <div className=" w-1/3 h-40  flex flex-col items-center justify-center space-y-2  ">
            <Mail size={50} strokeWidth={1} className="mt-2" />
            <p className=" font-cabinet font-semibold text-2xl ">Email us</p>
            <p className=" text-zinc-500 font-cabinet ">
              buxlofinance@gmail.com
              <br />
              contact@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default contact;
