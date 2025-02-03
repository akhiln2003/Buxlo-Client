import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import { BriefcaseBusiness, Dock, House, Megaphone, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AdminSideNavBar() {

  const {pathname} = useLocation();
  
  return (
    <div className="w-20  dark:bg-zinc-950 hidden md:flex flex-col  items-center space-y-8 pt-[1.5rem]  ">
      <Link to={AdminUrls.dashbord} className="flex-col items-center h-[3rem] w-3/4 mt-6  text-center ">
      <div className={`h-5/6 mx-[0.5rem] rounded-xl flex justify-center items-center ${ pathname == AdminUrls.dashbord  ? 'bg-zinc-300 dark:bg-zinc-900':  'hover:bg-zinc-50 dark:hover:bg-zinc-700'} `}><House /></div>
        <p className="text-xs font-cabinet ">Dashbord</p>
      </Link>
      <Link to={AdminUrls.userManagement} className="flex-col  justify-center items-center  h-[3rem] w-3/4 mt-6  text-center " >
      <div className={`h-5/6 mx-[0.5rem] rounded-xl flex justify-center items-center ${ pathname == AdminUrls.userManagement  ? 'bg-zinc-300 dark:bg-zinc-900':  'hover:bg-zinc-50 dark:hover:bg-zinc-700'} `}><Users /></div>
        <p className="text-xs font-cabinet ">Users</p>
      </Link>
      <Link to={AdminUrls.mentorManagement} className="flex-col items-center h-[3rem] w-3/4 mt-6  text-center ">
      <div className={`h-5/6 mx-[0.5rem] rounded-xl flex justify-center items-center ${ pathname == AdminUrls.mentorManagement  ? 'bg-zinc-300 dark:bg-zinc-900':  'hover:bg-zinc-50 dark:hover:bg-zinc-800'} `}><BriefcaseBusiness /></div>
        <p className="text-xs font-cabinet ">Mentors</p>
      </Link>
      <Link to={AdminUrls.advManagement} className="flex-col items-center h-[3rem] w-3/4 mt-6  text-center ">
      <div className={`h-5/6 mx-[0.5rem] rounded-xl flex justify-center items-center ${ pathname == AdminUrls.advManagement  ? 'bg-zinc-300 dark:bg-zinc-900':  'hover:bg-zinc-50 dark:hover:bg-zinc-800'} `}><Megaphone /></div>
        <p className="text-xs font-cabinet ">ADV</p>
      </Link>
      <Link to={AdminUrls.verifyprofile} className="flex-col items-center h-[3rem] w-3/4 mt-6  text-center ">
      <div className={`h-5/6 mx-[0.5rem] rounded-xl flex justify-center items-center ${ pathname == AdminUrls.verifyprofile  ? 'bg-zinc-300 dark:bg-zinc-900':  'hover:bg-zinc-50 dark:hover:bg-zinc-800'} `}><Dock /></div>
        <p className="text-xs font-cabinet ">KYC</p>
      </Link>
    </div>
  );
}

export default AdminSideNavBar;
