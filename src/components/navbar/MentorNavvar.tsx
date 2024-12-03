import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoWhite from '@/assets/images/logoWhite.png';
import logoBlack from '@/assets/images/logoBlack-.png';
import { Bell, LogIn, LogOut, Menu, MessageCircle, Sparkles, Sun, SunMoon, User, X } from 'lucide-react';
import profileImage from '@/assets/images/dummy-profile.webp'
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MentorUrl } from '@/@types/urlEnums/MentorUrl';

function MentorNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const darkModeHandler = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark');
    }
    const navigateLoginLogout = ()=>{
        navigate(MentorUrl.signIn)
    }
    const colorTheam = darkMode ? "white" : 'black'
    return (
        <>
            <nav className='fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md z-50'>
                <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Desktop Logo */}
                        <div className='flex-shrink-0 '>
                            <Link to={MentorUrl.home}>
                                <img
                                    src={darkMode ? logoWhite : logoBlack}
                                    alt="BUXLo Logo"
                                    className="h-16 w-auto " />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8 font-extrabold text-base">
                            <a href="#" className="text-gray-900 dark:text-white  hover:text-gray-500">DASHBORD</a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">PAGES</a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">ABOUT</a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ">Contact</a>
                        </div>

                        {/* Right side icons */}
                        <div className="hidden md:flex items-center space-x-4">


                            <DropdownMenu >
                                <DropdownMenuTrigger asChild  >
                                    <Bell size={25} strokeWidth={1.5} color={colorTheam} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className=' dark:bg-zinc-900 mr-9 w-[25rem]  h-[25rem] pt-5 overflow-y-scroll  scrollbar-thin dark:scrollbar-track-zinc-900 scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-500 scrollbar-track-gray scrollbar-track-rounded-full '>

                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3'>Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10</DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3' >Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10</DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3'><MessageCircle />Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10</DropdownMenuItem>
                                    <DropdownMenuItem className='border-b py-3' ><MessageCircle />Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10</DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>
                                    <DropdownMenuItem className='border-b h-fit py-3 px-2' > Completed a daily challenge for October LeetCoding Challenge 2024LeetCoin+10 </DropdownMenuItem>

                                    <div className="absolute pr-[2rem] flex justify-end  items-center bottom-0 left-0 w-[25rem] h-10 rounded-b-md bg-gray-100 dark:bg-zinc-900 py-3 shadow-sm shadow-gray-600 ">
                                        <DropdownMenuItem className=' '>...</DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>


                            <DropdownMenu >
                                <DropdownMenuTrigger asChild  >
                                    <div className="flex cursor-pointer"   >
                                        <img
                                            src={profileImage}
                                            alt="Mentor profile"
                                            className="h-8 w-8 rounded-full overflow-hidden object-cover"
                                        />
                                        {/* <ChevronDown color='#6e6e6e' size={25} className='mt-1' /> */}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='mr-9 min-w-[12rem]'>
                                    <DropdownMenuLabel><div className="flex cursor-pointer items-center  justify-start   "   >
                                        <img
                                            src={profileImage}
                                            alt="Mentor profile"
                                            className="h-8 w-8 rounded-full overflow-hidden object-cover "
                                        />
                                        <p className='ml-[0.5rem] font-semibold text-lg '> Akhil</p>
                                    </div></DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><Link to={MentorUrl.profile} className='flex' > <User size={15} /> <span className='ml-[0.5rem]' >Profile</span></Link> </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => darkModeHandler()} >
                                        <button className='flex' >
                                            {darkMode ? < Sun color='white' strokeWidth={1.5} size={19} /> : < SunMoon strokeWidth={1.5} />}
                                            <span className='ml-[0.5rem]'>Team</span>
                                        </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem><Link to={MentorUrl.home} className='flex' > < Sparkles size={15}  strokeWidth={2.5}/> <span className='ml-[0.5rem]'>Subscription</span></Link></DropdownMenuItem>
                                    <DropdownMenuItem onClick={navigateLoginLogout} >
                                        <LogIn size={20} /><span className='ml-[0.5rem]'>SignIn</span>
                                        {/* <Link to={MentorUrl.signOut} className=' w-full flex text-red-700'><LogOut size={20}/><span className='ml-[0.5rem]'>SignOut</span></Link> */}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>


                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-gray-500 hover:text-gray-900"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOpen ? (
                                    <X />
                                ) : (
                                    <Menu size={20} />
                                )}
                            </motion.button>
                        </div>

                    </div>

                    {/* Mobile menu */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`md:hidden overflow-hidden`}
                    >
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-900  ">Dashboard</a>
                            <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-900">PAGES</a>
                            <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-900">ABOUT</a>
                            <a href="#" className="block px-3 py-2 text-gray-500 hover:text-gray-900">Contact</a>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </>
    )
}

export default MentorNavbar
