// import React from 'react'

import { Link } from "react-router-dom"
import { IsignUpFormProps } from "../types/Iprops"
import { UserUrls } from "@/@types/enums/UserUrls"
import { ArrowLeft, ChevronLeft } from "lucide-react"

function SignUpForm({ setIsFormVisible }: IsignUpFormProps) {
  const navigateOptions = () => {
    setIsFormVisible(false)
  }
  return (
    <>
      <div className=' dark:bg-zinc-800 min-h-screen'>

        <div className='w-full'>
          <div className='w-full flex justify-between items-center pt-12 px-[2rem] '>

            <Link to={UserUrls.home} className="flex items-center  group">
              <div className='relative w-5 h-5 items-start'>
                <ChevronLeft className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full" strokeWidth={2.5} />
                <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
              </div>
              <span className="ml-1 font-cabinet text-sm" >BACK</span>
            </Link>


            <Link to={UserUrls.signIn} >
              <span className="font-cabinet font-semibold text-xs relative group ">
                SIGN IN
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

          </div>
        </div>

        <div className='w-full flex flex-col items-center mt-[2rem] '>
          <p className="text-2xl font-semibold font-supreme">Create Your Account</p>
        </div>

        <div className="w-full flex flex-col items-center py-10">

          <div className="w-[22rem] h-96 bg-slate-100"></div>

          <div className='w-full flex flex-col items-center justify-center  mt-[1rem]'>
            <p className='text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium' >By creating an account, you agree to our <span className=' underline '>Terms of Service</span></p>
            <p className='text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium ' >and have read and understood the <span className=' underline'>Privacy Policy</span></p>
          </div>

          <div className="w-[22rem] h-10 bg-slate-100 my-5 flex justify-center items-center">Continue</div>
          <span className="font-cabinet font-semibold text-sm relative group mb-5 cursor-pointer" onClick={() => navigateOptions}>
            Back
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
          </span>


          <div className='w-full flex flex-col items-center justify-center  mt-[1rem]'>
            <p className='text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium' >Secure Login with reCAPTCHA subject to Google</p>
            <p className='text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium ' > <span className="underline">Terms </span> & <span className=' underline'>Privacy.</span></p>
          </div>
        </div>




      </div>
    </>
  )
}

export default SignUpForm