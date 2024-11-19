import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoWhite from '@/assets/images/logo-white.png';
import logoBlack from '@/assets/images/logo-black.png'
import { Bell, ChevronDown, Menu, Sun, SunMoon, X } from 'lucide-react';
import profileImage from '@/assets/images/dummy-profile.webp'
import { motion } from 'framer-motion';

function UserNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode , setDarkMode ] = useState(false);

    const darkModeHandler = ()=>{
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark');
    }
    const colorTheam = darkMode ? "white" : 'black'
    return (
        <>
            <nav className='fixed top-0 left-0 right-0 bg-white/70 dark:bg-black/50 backdrop-blur-md z-50'>
                <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Desktop Logo */}
                        <div className='flex-shrink-0 '>
                            <Link to='/'>
                                <img
                                    src={ !darkMode ? logoWhite : logoBlack}
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
                        <motion.button onClick={()=> darkModeHandler()} >
                            {darkMode ? < Sun color='white'/> :  < SunMoon strokeWidth={1.5}  />}
                            
                           
                        </motion.button>
                            <button className="p-2 text-gray-800 hover:text-black">
                                <Bell size={25} strokeWidth={1.5} color={colorTheam} />
                            </button> 
                            <div className="flex cursor-pointer"  >
                                <img
                                    src={profileImage}
                                    alt="User profile"
                                    className="h-8 w-8 rounded-full overflow-hidden object-cover"
                                />
                                <ChevronDown color='#6e6e6e' size={25} className='mt-1' />
                            </div>
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
                                    <X/>
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

export default UserNavbar
