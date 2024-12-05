import landingPageBG from '@/assets/images/landingPageBG.jpg';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
function LandingPage() {
  return (
    <div className="w-full ">
      <div
        style={{ backgroundImage: `url(${landingPageBG})` }}
        className="w-full h-screen -mt-16 bg-cover bg-center bg-no-repeat flex items-center justify-center relative bg-white/80 dark:bg-black/85 bg-blend-color-dodge"
      >
        <div className="text-center text-black px-4 z-10">
          <h1 className="text-5xl font-sans font-extrabold mb-4 drop-shadow-md dark:text-white/90">Built to power the world  of digital finance </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow-md dark:text-white/90">
            Reviewing transactions, monitoring your spending and tracking your net worth now have a new home.
          </p>

        </div>

        <div className='absolute bottom-14 right-8 '>
          <motion.div whileHover={{ scale: 1.2 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border bg-gray-900 cursor-pointer ">
            <Bot size={30} color='white' />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;