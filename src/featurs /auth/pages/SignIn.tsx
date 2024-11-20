// import logoIconWhite from '@/assets/images/logoIconWhite.png';
import logoIconBlack from '@/assets/images/logoIconBlack.png';
import { Link } from 'react-router-dom';
import { UserUrls } from '@/@types/enums/UserUrls';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

function SignIn() {
  return (
    <>
      <div className='w-full '>
        <div className='w-full flex justify-between items-center pt-12 px-[2rem] '>
          <Link to={UserUrls.home} className="flex items-center  group">
            <div className='relative w-5 h-5 items-start'>
              <ChevronLeft className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full" strokeWidth={2.5} />
              <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
            </div>
            <span className="ml-1">BACK</span>
          </Link>


          <Link to={UserUrls.signUp} >
            <span className="font-cabinet font-semibold text-xs relative group">
              CREATE ACCOUNT
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </div>
      </div>
      <div className='w-full flex flex-col items-center mt-[3rem] '>
        <div className='w-10  '>
          <img src={logoIconBlack} alt="BUXLO ICON" />
        </div>
        <p className="text-2xl font-semibold font-supreme">Sign Into Buxlo</p>
      </div>
      <div className='w-full flex items-center justify-center  mt-[3rem]'>
        <div className='w-[55rem] h-24 flex justify-center '>
          <div className='w-1/2  h-full'></div>
          <div className='h-full flex flex-col justify-between items-center'>
            <div className='h-1/3 bg-zinc-500 w-0.5'></div>
            <span className='text-zinc-800 font-cabinet font-semibold text-sm' >OR</span>
            <div className='h-1/3 bg-zinc-500 w-0.5'></div>
          </div>
          <div className='w-1/2  h-full'></div>
        </div>
      </div>
    </>
  )
}

export default SignIn