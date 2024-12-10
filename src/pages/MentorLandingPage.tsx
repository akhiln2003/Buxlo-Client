import { motion } from "framer-motion";

function MentorLandingPage() {
  const Title = "Unlock Financial Success with Buxlo Mentors".split(" ");
  const description =
    "Guide, inspire, and transform lives with your financial expertise on Buxlo. Join our network of mentors and make a lasting impact today!".split(
      " "
    );

  return (
    <div className="w-full flex relative">
      <div className="w-full h-screen bg-zinc-100 dark:bg-zinc-900 -mt-16 bg-cover bg-center bg-no-repeat blur-md"></div>
      <div className="w-full h-96 absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-cabinet font-extrabold mb-4 drop-shadow-md  ">
          {Title.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                repeatDelay: i * 5, // Delay between each word's animation

                delay: i / 12,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow-md ">
          {description.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1], // Fade in and out (breathing)
              }}
              transition={{
                duration: 1.5, // Duration for one breathing cycle
                ease: "easeInOut", // Smooth easing
                repeatDelay: i * 0.5, // Delay between each word's animation
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default MentorLandingPage;
