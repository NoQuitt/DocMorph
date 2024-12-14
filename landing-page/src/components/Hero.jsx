import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Contenuto Hero */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
          DocMorph AI
        </h1>
        <p className="text-lg lg:text-2xl mt-4 text-gray-300 max-w-2xl">
          Reinvent document management with cutting-edge AI technology.
        </p>
        <motion.button
          className="mt-8 py-3 px-10 bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-bold rounded-full hover:scale-110 transition-transform shadow-lg hover:shadow-pink-500/50"
          whileHover={{ scale: 1.2 }}
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
